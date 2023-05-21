// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "./Betting.sol";

contract Oracle {
  /**

    // 0 betEpoch, 1 reviewStatus, 2 propNumber, 3 timer, 4 totKontract Tokens, 5 yesVotes, 6 noVotes, 7 feePool
    */
  uint32[4] public params;
  //   0 totKontract Tokens, 1 yesVotes, 2 noVotes, 3 feePool
  uint64[4] public params2;
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
  //uint256 public top;
  uint32 public constant HOUR_POST = 12;
  uint32 public constant HOUR_PROCESS = 18;
  // minimum bet in 0.1 finneys
  uint32 public constant MIN_SUBMIT = 5e7;
  uint64 public constant ONE_MILLION = 1e6;
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
    uint64 tokens;
    uint64 voteTracker;
    uint64 initFeePool;
  }

  event ResultsPosted(uint32 epoch, uint32 propnum, uint8[32] winner);

  event DecOddsPosted(uint32 epoch, uint32 propnum, uint32[32] decOdds);

  event VoteOutcome(
    bool voteResult,
    uint32 propnum,
    uint32 epoch,
    uint64 yesvotes,
    uint64 novotes
  );

  event BetDataPosted(uint32 epoch, uint32 propnum, uint32[32] oddsStart);

  event ParamsPosted(uint32 concLimit);

  event PausePosted(uint8 pausedMatch1, uint8 pausedMatch2);

  event StartTimesPosted(uint32 propnum, uint32 epoch, uint32[32] starttimes);

  event SchedulePosted(uint32 epoch, uint32 propnum, string[32] sched);

  event Funding(uint64 tokensChange, uint256 etherChange, address transactor);

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
    require(params[1] >= 10);
    // voter must not have voted on this proposal
    require(adminStruct[msg.sender].voteTracker != params[2]);
    // this prevents this account from voting again on this data proposal (see above)
    adminStruct[msg.sender].voteTracker = params[2];
    // votes are simply one's entire token balance deposited in this oracle contract
    if (_sendData) {
      params2[1] += adminStruct[msg.sender].tokens;
    } else {
      params2[2] += adminStruct[msg.sender].tokens;
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

  function initProcess() external returns (bool) {
    // this prevents an odds or results proposal from  being sent
    require(params[1] == 10, "wrong data");
    // can only send after 12 noon GMT
    require(hourOfDay() >= HOUR_PROCESS, "too soon");
    // only sent if 'null' vote does not win
    if (params2[1] > params2[2]) {
      // sends to the betting contract
      bettingContract.transmitInit(propOddsStarts);
      emit VoteOutcome(true, params[0], params[2], params2[1], params2[2]);
    } else {
      burnAndReset();
    }
    reset();
    params[1] = 2;
    return true;
  }

  // updates odds on existing odds
  function updateProcess() external returns (bool) {
    // this prevents an 'initProcess' set being sent as an odds transmit
    require(params[1] == 20, "wrong data");
    // needs at least 5 hours
    require(hourOfDay() >= HOUR_PROCESS, "too soon");
    if (params2[1] > params2[2]) {
      bettingContract.transmitUpdate(propOddsUpdate);
      emit VoteOutcome(true, params[0], params[2], params2[1], params2[2]);
    } else {
      burnAndReset();
    }
    reset();
    params[1] = 2;
    return true;
  }

  function settlePost(uint8[32] memory _resultVector) external returns (bool) {
    // this prevents a settle post when other posts have been made
    require(params[1] == 2, "wrong sequence");
    post();
    propResults = _resultVector;
    emit ResultsPosted(params[0], params[2], _resultVector);
    params[1] = 30;
    return true;
  }

  function settleProcess() external returns (bool) {
    require(params[1] == 30, "wrong data");
    require(hourOfDay() >= HOUR_PROCESS, "too soon");
    if (params2[1] > params2[2]) {
      (uint32 _epoch, uint256 ethDividend) = bettingContract.settle(
        propResults
      );
      params[0] = _epoch;
      params2[3] += uint64(ethDividend / uint256(params2[0]) / 1e5);
      emit VoteOutcome(true, params[0], params[2], params2[1], params2[2]);
    } else {
      burnAndReset();
    }
    reset();
    params[1] = 0;
    return true;
  }

  function paramUpdate(uint32 _concentrationLim) external returns (bool) {
    require(adminStruct[msg.sender].tokens >= 5e8);
    bettingContract.adjustParams(_concentrationLim);
    emit ParamsPosted(_concentrationLim);
    return true;
  }

  function pauseMatches(uint8 _match1, uint8 _match2) external {
    // submitter must have at least 5% of outstanding tokens for this emergency function
    require(adminStruct[msg.sender].tokens >= 5e7);
    bettingContract.pauseMatch(_match1, _match2);
    emit PausePosted(_match1, _match2);
  }

  function depositTokens(uint64 _amt) external {
    uint256 ethClaim;
    bool success;
    if (adminStruct[msg.sender].tokens > 0) {
      ethClaim =
        uint256(
          adminStruct[msg.sender].tokens *
            (params2[3] - adminStruct[msg.sender].initFeePool)
        ) *
        1e5;
      //payable(msg.sender).transfer(ethClaim);
      (success, ) = payable(msg.sender).call{ value: ethClaim }("");
      require(success, "Call failedbb");
    }
    (success) = token.transferFrom(msg.sender, address(this), _amt);
    require(success, "not success");
    adminStruct[msg.sender].initFeePool = params2[3];
    adminStruct[msg.sender].tokens += _amt;
    params2[0] += _amt;
    emit Funding(_amt, ethClaim, msg.sender);
  }

  function withdrawTokens(uint64 _amtTokens) external {
    //require(_amtTokens <= adminStruct[msg.sender].tokens, "need tokens");
    // this prevents voting more than once or oracle proposals with token balance.
    require(params[1] < 10, "no wd during vote");
    bool success;
    uint256 ethClaim = uint256(
      adminStruct[msg.sender].tokens *
        (params2[3] - adminStruct[msg.sender].initFeePool)
    ) * 1e5;
    adminStruct[msg.sender].initFeePool = params2[3];
    params2[0] -= _amtTokens;
    adminStruct[msg.sender].tokens -= _amtTokens;
    //payable(msg.sender).transfer(ethClaim);
    //ethClaim = 1e16;

    (success, ) = payable(msg.sender).call{ value: ethClaim }("");
    require(success, "Call failed");

    (success) = token.transfer(msg.sender, _amtTokens);
    require(success, "token failed");

    emit Funding(_amtTokens, ethClaim, msg.sender);
  }

  function post() internal {
    uint256 hour = hourOfDay();
    require(hour == HOUR_POST, "wrong hour");
    // this ensures only significant token holders are making proposals, blocks trolls
    require(adminStruct[msg.sender].tokens >= MIN_SUBMIT, "Need 5% of tokens");
    params2[1] = adminStruct[msg.sender].tokens;
    proposer = msg.sender;
    // this prevents proposer from voting again with his tokens on this submission
    adminStruct[msg.sender].voteTracker = params[2];
  }

  function reset() internal {
    // adds to nonce tracking proposals
    params[2]++;
    // resets yes vote count to zero
    params2[1] = 0;
    // resets no votes count to zero
    params2[2] = 0;
  }

  function burnAndReset() internal returns (bool success) {
    uint32 burnAmt = MIN_SUBMIT / 5;
    params2[0] -= burnAmt;
    adminStruct[proposer].tokens -= burnAmt;
    success = token.burn(burnAmt);
    emit VoteOutcome(false, params[0], params[2], params2[1], params2[2]);
    require(success, "token burn failed");
  }

  function create96(uint32[32] memory _time, uint32[32] memory _odds)
    internal
    pure
    returns (uint96[32] memory outv)
  {
    uint32 g;
    uint96 out;
    for (uint256 i = 0; i < 32; i++) {
      if (_time[i] != 0) {
        require(_odds[i] > 125 && _odds[i] < 1000);
        require(_time[i] >= _time[0]);
        g = 1e6 / (41 + _odds[i]) - 41;
        out |= uint96(_time[i]) << 64;
        out |= uint96(_odds[i]) << 32;
        out |= uint96(g);
        outv[i] = out;
      }
      delete out;
    }
  }

  function create64(uint32[32] memory _odds)
    internal
    pure
    returns (uint64[32] memory outv)
  {
    uint32 f;
    uint64 out;
    for (uint256 i = 0; i < 32; i++) {
      require(_odds[i] > 110 && _odds[i] < 1500);
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
