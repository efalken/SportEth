// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "./Betting.sol";

contract Oracle {
  /**

    // 0 betEpoch, 1 reviewStatus, 2 propNumber, 3 timer, 4 totKontract Tokens, 5 yesVotes, 6 noVotes, 7 feePool
    */
  uint32[8] public params;
  // propStartTime in UTC is used to stop active betting. No bets are taken after this time.
  uint96[32] public propOddsStarts;
  // smaller data from propOddsStarts because one cannot change the start times
  uint64[32] public propOddsUpdate;
  // results are 0 for team 0 winning, 1 for team 1 winning
  // slots are 0 for the initial favorite, 1 for initial underdog
  uint8[32] public propResults;
  /** the schedule is a record of "sport:home:away", such as "NFL:NYG:SF" for us football,
    New York Giants vs San Francisco
    */
  uint256 public top;
  uint32 public constant HOUR_POST_INIT = 0;
  uint32 public constant HOUR_PROCESS_INIT = 0;
  // minimum bet in 0.1 finneys
  uint32 public constant MIN_SUBMIT = 50;
  string[32] public matchSchedule;
  // keeps track of those who supplied data proposals.
  address public proposer;
  // track token holders: amount, whether they voted, their basis for the token fees
  mapping(address => AdminStruct) public adminStruct;
  // this allows the contract to send the tokens
  Token public token;
  // link to communicate with the betting contract
  Betting public bettingContract;

  /** tokens are held in the custody of this contract. Only tokens deposited in this contract can
    // be used for voting or for claiming oracle ether.
    */
  struct AdminStruct {
    uint32 tokens;
    uint32 voteTracker;
    uint32 initFeePool;
  }

  event ResultsPosted(uint32 epoch, uint32 propnum, uint8[32] winner);

  event DecOddsPosted(uint32 epoch, uint32 propnum, uint32[32] decOdds);

  event VoteOutcome(bool voteResult, uint32 propnum, uint32 epoch);

  event BetDataPosted(uint32 epoch, uint32 propnum, uint32[32] oddsStart);

  event ParamsPosted(uint32 concLimit);

  event PausePosted(uint8 pausedMatch1, uint8 pausedMatch2);

  event StartTimesPosted(uint32 propnum, uint32 epoch, uint32[32] starttimes);

  event SchedulePosted(uint32 epoch, uint32 propnum, string[32] sched);

  event Funding(uint32 tokensChange, uint256 etherChange, address transactor);

  constructor(address payable bettingk, address payable _token) {
    bettingContract = Betting(bettingk);
    token = Token(_token);
    params[3] = 2e9;
    params[0] = 1;
    params[2] = 1;
  }

  function vote(bool _sendData) external {
    // voter must have votes to allocate
    require(adminStruct[msg.sender].tokens > 0);
    // can only vote if there is a proposal
    require(params[1] != 0);
    // voter must not have voted on this proposal
    require(adminStruct[msg.sender].voteTracker != params[2]);
    // this prevents this account from voting again on this data proposal (see above)
    adminStruct[msg.sender].voteTracker = params[2];
    // votes are simply one's entire token balance deposited in this oracle contract
    if (_sendData) {
      params[5] += adminStruct[msg.sender].tokens;
    } else {
      params[6] += adminStruct[msg.sender].tokens;
    }
  }

  receive() external payable {}

  fallback() external {}

  function initPost(
    string[32] memory _teamsched,
    uint32[32] memory _starts,
    uint32[32] memory _decimalOdds
  ) external {
    // this requirement makes sure a post occurs only if there is not a current post under consideration
    require(params[1] == 0, "Already under Review");
    propOddsStarts = create96(_starts, _decimalOdds);
    post();
    matchSchedule = _teamsched;
    // this tells users that an initial proposal has been sent
    emit SchedulePosted(params[0], params[2], _teamsched);
    emit StartTimesPosted(params[0], params[2], _starts);
    emit DecOddsPosted(params[0], params[2], _decimalOdds);
    params[1] = 10;
  }

  function updatePost(uint32[32] memory _decimalOdds) external {
    require(params[1] == 2, "wrong sequence");
    post();
    propOddsUpdate = create64(_decimalOdds);
    emit DecOddsPosted(params[0], params[2], _decimalOdds);
    params[1] = 20;
  }

  function initProcess() external {
    // this prevents an odds or results proposal from  being sent
    require(params[1] == 10, "wrong data");
    // can only send after 8 PM GMT
    require(hourOfDay() >= HOUR_PROCESS_INIT, "too soon");
    // only sent if 'null' vote does not win
    if (params[5] > params[6]) {
      // sends to the betting contract
      bettingContract.transmitInit(propOddsStarts);
      emit VoteOutcome(true, params[0], params[2]);
    } else {
      params[4] -= (MIN_SUBMIT / 2);
      adminStruct[proposer].tokens -= (MIN_SUBMIT / 2);
      emit VoteOutcome(false, params[0], params[2]);
    }
    reset();
    params[1] = 2;
  }

  // updates odds on existing odds
  function updateProcess() external {
    // this prevents an 'initProcess' set being sent as an odds transmit
    require(params[1] == 20, "wrong data");
    // needs at least 5 hours
    require(hourOfDay() >= HOUR_PROCESS_INIT, "too soon");
    if (params[5] > params[6]) {
      bettingContract.transmitUpdate(propOddsUpdate);
      //      (bool success, uint256 ethDividend) = address(bettingContract).call{
      //   gas: 1e7
      // }(abi.encodeWithSignature("settle(uint256)", propResults));
      // (uint256 ethDividend) = abi.decode(_x, (uint256));
      emit VoteOutcome(true, params[0], params[2]);
    } else {
      params[4] -= (MIN_SUBMIT / 2);
      adminStruct[proposer].tokens -= (MIN_SUBMIT / 2);
      emit VoteOutcome(false, params[0], params[2]);
    }
    reset();
    params[1] = 2;
  }

  function settlePost(uint8[32] memory _resultVector) external {
    // this prevents a settle post when other posts have been made
    require(params[1] == 2, "wrong sequence");
    post();
    propResults = _resultVector;
    emit ResultsPosted(params[0], params[2], _resultVector);
    params[1] = 30;
  }

  function settleProcess() external {
    require(params[1] == 30, "wrong data");
    require(hourOfDay() >= HOUR_PROCESS_INIT, "too soon");
    uint32 ethDividend;
    uint32 _epoch;
    if (params[5] > params[6]) {
      (_epoch, ethDividend) = bettingContract.settle(propResults);
      params[0] = _epoch;
      params[7] += ethDividend / params[4];
      emit VoteOutcome(true, params[0], params[2]);
    } else {
      params[4] -= (MIN_SUBMIT / 2);
      adminStruct[proposer].tokens -= (MIN_SUBMIT / 2);
      emit VoteOutcome(false, params[0], params[2]);
    }
    reset();
    params[1] = 0;
  }

  function paramUpdate(uint32 _concentrationLim) external {
    require(adminStruct[msg.sender].tokens >= 5e8);
    bettingContract.adjustParams(_concentrationLim);
    emit ParamsPosted(_concentrationLim);
  }

  function pauseMatches(uint8 _match1, uint8 _match2) external {
    // submitter must have at least 5% of outstanding tokens for this emergency function
    require(adminStruct[msg.sender].tokens >= 5e7);
    bettingContract.pauseMatch(_match1, _match2);
    emit PausePosted(_match1, _match2);
  }

  function depositTokens(uint32 _amt) external {
    uint256 ethClaim;
    bool success;
    if (adminStruct[msg.sender].tokens > 0) {
      ethClaim =
        uint256(
          adminStruct[msg.sender].tokens *
            (params[7] - adminStruct[msg.sender].initFeePool)
        ) *
        1e12;
      //payable(msg.sender).transfer(ethClaim);
      (success, ) = payable(msg.sender).call{ value: ethClaim }("");
      require(success, "Call failed");
    }
    (success) = token.transferFrom(msg.sender, address(this), _amt);
    require(success, "not success");
    adminStruct[msg.sender].initFeePool = params[7];
    adminStruct[msg.sender].tokens += _amt;
    params[4] += _amt;
    emit Funding(_amt, ethClaim, msg.sender);
  }

  function withdrawTokens(uint32 _amtTokens) external {
    require(_amtTokens <= adminStruct[msg.sender].tokens, "need tokens");
    // this prevents voting more than once or oracle proposals with token balance.
    require(params[1] < 10, "no wd during vote");
    bool success;
    uint256 ethClaim = uint256(
      adminStruct[msg.sender].tokens *
        (params[7] - adminStruct[msg.sender].initFeePool)
    ) * 1e12;
    adminStruct[msg.sender].initFeePool = params[7];
    params[4] -= _amtTokens;
    adminStruct[msg.sender].tokens -= _amtTokens;
    payable(msg.sender).transfer(ethClaim);
    (success, ) = payable(msg.sender).call{ value: ethClaim }("");
    require(success, "Call failed");
    (success) = token.transfer(address(this), _amtTokens);
    require(success, "token failed");
    emit Funding(_amtTokens, ethClaim, msg.sender);
  }

  function post() internal {
    uint256 hour = hourOfDay();
    // ************ change 24
    require(hour >= HOUR_POST_INIT && hour < (HOUR_POST_INIT + 24));
    // this ensures only significant token holders are making proposals, blocks trolls
    require(adminStruct[msg.sender].tokens >= MIN_SUBMIT, "Need 5% of tokens");
    params[5] = adminStruct[msg.sender].tokens;
    proposer = msg.sender;
    // this prevents proposer from voting again with his tokens on this submission
    adminStruct[msg.sender].voteTracker = params[2];
  }

  function reset() internal {
    // adds to nonce tracking proposals
    params[2]++;
    // resets yes votes
    params[5] = 0;
    // resets no votes
    params[6] = 0;
  }

  function create96(uint32[32] memory _time, uint32[32] memory _odds)
    internal
    returns (uint96[32] memory outv)
  {
    uint32 g;
    uint96 out;
    for (uint256 i = 0; i < 32; i++) {
      require(_odds[i] > 125 && _odds[i] < 5000);
      if (_time[i] != 0) {
        require(_time[i] >= _time[0]);
        g = 1e6 / (41 + _odds[i]) - 41;
        out |= uint96(_time[i]) << 64;
        out |= uint96(_odds[i]) << 32;
        out |= uint96(g);
        outv[i] = out;
      } else {
        top = i;
        i = 32;
      }
      delete out;
    }
  }

  function create64(uint32[32] memory _odds)
    internal
    view
    returns (uint64[32] memory outv)
  {
    uint32 f;
    uint64 out;
    for (uint256 i = 0; i < top; i++) {
      require(_odds[i] > 125 && _odds[i] < 3000);
      f = 1e6 / (41 + _odds[i]) - 41;
      out |= uint64(_odds[i]) << 32;
      out |= uint64(f);
      outv[i] = out;
      delete out;
    }
  }

  function hourOfDay() internal view returns (uint256 hour) {
    hour = (block.timestamp % 86400) / 3600;
  }
}
