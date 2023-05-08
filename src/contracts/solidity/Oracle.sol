// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "./Betting.sol";

contract Oracle {
  /**
    // after each settlement, a new epoch commences. Bets cannot consummate on games referring to prior epochs
    // This is true if there is a proposal under consideration, other proposals are not allowed while a current proposal
    // is under review: 0 null, 1 init, 2 odds, 3 settle
    // this tracking number is for submissions, needed for tracking whether someone already voted on a data proposal
    // incremented at each processing
    // timer is used so that each proposal has at least a 5 hours for voters to respond
    // tracks the current local token balance of active oracle contract administrators, as
    // documented by the deposit of their tokens within this contract
    // A proposal goes through via a simple rule of more yes than no votes.
      Thus, a trivial vote does not need more yes votes
    // if a troll rejects a vote that has few Yes votes, a vote later than evening takes a large bond amount, so
    // and submitters should anticipate such an event
    // 0 betEpoch, 1 reviewStatus, 2 propNumber, 3 timer, 4 totKontract Tokens, 5 yesVotes, 6 noVotes, 7 feePool
    */
  uint32[8] public params;
  // propStartTime in UTC is used to stop active betting. No bets are taken after this time.
  uint96[32] public propOddsStarts;
  uint64[32] public propOddsUpdate;
  uint8[32] public propResults;
  /** the schedule is a record of "sport:home:away", such as "NFL:NYG:SF" for us football,
    New York Giants vs San Francisco
    */
  string[32] public matchSchedule;
  // keeps track of those who supplied data proposals. Proposers have to deposit tokens as a bond, and if their
  // proposal is rejected, they lose that bond.
  address public proposer;
  mapping(address => AdminStruct) public adminStruct;
  // this allows the contract to send the tokens
  Token public token;
  // link to communicate with the betting contract
  Betting public bettingContract;
  uint32 public constant CURE_TIME = 0 hours;
  uint32 public constant HOUR_START = 0;
  uint32 public constant HOUR_END = 24;
  uint32 public constant MIN_SUBMIT = 50;

  /** tokens are held in the custody of this contract. Only tokens deposited in this contract can
    // be used for voting or for claiming oracle ether. Note these tokens are owned by the oracle contract while deposited
    // as far as the ERC-20 contract is concerned, but they are credited to the token depositors within this contract
    // voteTrackr keeps track of the proposals in this contract, so that token holders can only vote once for each proposal
    // with the tokens they have in this contract. initFeePool references the start date to allocate correct oracleDiv
    // token revenue
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
    // this requirement makes sure a post occurs only if there is not a current post under consideration, or
    // it is an amend for an earlier post with these data
    require(params[1] == 0, "Already under Review");
    propOddsStarts = create96(_starts, _decimalOdds);
    params[1] = 1;
    post();
    matchSchedule = _teamsched;
    // this tells users that an inimtial proposal has been sent, which is useful
    // for oracle administrators who are monitoring this contract
    emit SchedulePosted(params[0], params[2], _teamsched);
    emit StartTimesPosted(params[0], params[2], _starts);
    emit DecOddsPosted(params[0], params[2], _decimalOdds);
  }

  function updatePost(uint32[32] memory _decimalOdds) external {
    require(params[1] == 0, "Already under Review");
    params[1] = 2;
    post();
    propOddsUpdate = create64(_decimalOdds);
    emit DecOddsPosted(params[0], params[2], _decimalOdds);
  }

  function settlePost(uint8[32] memory _resultVector) external {
    // this prevents a settle post when other posts have been made
    require(params[1] == 0, "Already under Review");
    params[1] = 3;
    post();
    propResults = _resultVector;
    emit ResultsPosted(params[0], params[2], _resultVector);
  }

  function initProcess() external {
    // this prevents an odds or results proposal from  being sent
    require(params[1] == 1, "wrong data");
    // needs at least 5 hours
    require(block.timestamp > params[3], "too soon");
    // only sent if 'null' vote does not win
    if (params[5] > params[6]) {
      // sends to the betting contrac
      bettingContract.transmitInit(propOddsStarts);
      emit VoteOutcome(true, params[0], params[2]);
    } else {
      params[4] -= (MIN_SUBMIT / 2);
      adminStruct[proposer].tokens -= (MIN_SUBMIT / 2);
      emit VoteOutcome(false, params[0], params[2]);
    }
    // resets various data (eg, params[3])
    reset();
  }

  // these have the same logic as for the initProcess, just for the different datasets
  function updateProcess() external {
    // this prevents an 'initProcess' set being sent as an odds transmit
    require(params[1] == 2, "wrong data");
    // needs at least 5 hours
    require(block.timestamp > params[3], "too soon");
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
  }

  function settleProcess() external {
    require(params[1] == 3, "wrong data");
    // needs at least 5 hours
    require(block.timestamp > params[3], "too soon");
    uint32 ethDividend;
    uint32 _epoch;
    if (params[5] > params[6]) {
      (_epoch, ethDividend) = bettingContract.settle(propResults);
      /*(bool success, bytes memory _x) = address(bettingContract).call{
        gas: 1200000
      }(abi.encodeWithSignature("settle(uint8[32])", propResults));
      require(success);
      (_epoch, ethDividend) = abi.decode(_x, (uint32, uint32));*/
      params[0] = _epoch;
      params[7] += ethDividend / params[4];
      emit VoteOutcome(true, params[0], params[2]);
    } else {
      params[4] -= (MIN_SUBMIT / 2);
      adminStruct[proposer].tokens -= (MIN_SUBMIT / 2);
      emit VoteOutcome(false, params[0], params[2]);
    }
    reset();
  }

  function paramUpdate(uint32 _concentrationLim) external {
    // In the first case, an immediate send allows a simple way to protect against stale odds
    // a high minimum bet would prevent new bets while odds are voted upon
    // in the second case, a large token holder can , "Low Balance");
    require(adminStruct[msg.sender].tokens >= 5e8);
    //bettingContract.adjustParams(_concentrationLim);
    (bool success, ) = address(bettingContract).call{ gas: 1e7 }(
      abi.encodeWithSignature("adjustParams(uint32)", _concentrationLim)
    );
    require(success);
    emit ParamsPosted(_concentrationLim);
  }

  function withdrawTokens(uint32 _amtTokens) external {
    require(_amtTokens <= adminStruct[msg.sender].tokens, "need tokens");
    // this prevents voting more than once or oracle proposals with token balance.
    require(params[1] == 0, "no wd during vote");
    bool success;
    uint256 ethClaim = uint256(
      adminStruct[msg.sender].tokens *
        (params[7] - adminStruct[msg.sender].initFeePool)
    ) * 1e12;
    adminStruct[msg.sender].initFeePool = params[7];
    params[4] -= _amtTokens;
    adminStruct[msg.sender].tokens -= _amtTokens;
    //payable(msg.sender).transfer(ethClaim);
    (success, ) = payable(msg.sender).call{ value: ethClaim }("");
    require(success, "Call failed");
    // success = token.transfer(msg.sender, _amtTokens);
    // (success, ) = address(token).delegatecall{ gas: 70000 }(
    //   abi.encodeWithSignature(
    //     "transfer(address, uint32)",
    //     msg.sender,
    //     _amtTokens
    //   )
    // );
    (bool success2, ) = address(token).call{ gas: 56000 }(
      abi.encodeWithSignature(
        "transfer(address,uint32)",
        msg.sender,
        _amtTokens
      )
    );
    require(success2, "token failed");
    emit Funding(_amtTokens, ethClaim, msg.sender);
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
    //(success) = token.transferFrom(msg.sender, address(this), _amt);
    (success, ) = address(token).call{ gas: 40000 }(
      abi.encodeWithSignature(
        "transferFrom(address,address,uint32)",
        msg.sender,
        address(this),
        _amt
      )
    );
    require(success, "not success");
    adminStruct[msg.sender].initFeePool = params[7];
    adminStruct[msg.sender].tokens += _amt;
    params[4] += _amt;
    emit Funding(_amt, ethClaim, msg.sender);
  }

  function showSchedString() external view returns (string[32] memory) {
    return matchSchedule;
  }

  // this is used so users do not have to delegate someone else to monitor the contract 24/7
  // 86400 is seconds in a day, and 3600 is seconds in an hour
  // restricts contract submission to between 5am-8pm in summer, 6am-9pm in winter
  function hourOfDay() public view returns (uint256 hour) {
    hour = (block.timestamp % 86400) / 3600;
    require(hour >= HOUR_START);
    //require(hour >= HOUR_START && hour < HOUR_END);
  }

  function post() internal {
    // constraining the hourOfDay to be > 10 gives users a block of time where they can be confident that their
    // inattention to the contract poses no risk of a malicious data submission.
    hourOfDay();
    // this ensures only significant token holders are making proposals, blocks trolls
    require(adminStruct[msg.sender].tokens >= MIN_SUBMIT, "Low Balance");
    params[3] = uint32(block.timestamp) + CURE_TIME;
    params[5] = adminStruct[msg.sender].tokens;
    proposer = msg.sender;
    // If strict majority of total tokens, time delay irrelevant
    if (adminStruct[msg.sender].tokens > 500) params[3] = 0;
    // this prevents proposer from voting again with his tokens on this submission
    adminStruct[msg.sender].voteTracker = params[2];
  }

  function reset() internal {
    params[1] = 0;
    params[2]++;
    params[3] = 0;
    params[5] = 0;
    params[6] = 0;
  }

  function create96(uint32[32] memory _time, uint32[32] memory _odds)
    internal
    pure
    returns (uint96[32] memory outv)
  {
    uint32 g;
    uint96 out;
    for (uint256 i = 0; i < 32; i++) {
      require(_odds[i] > 125 && _odds[i] < 1000 && _time[i] >= _time[0]);
      g = 1e6 / (41 + _odds[i]) - 41;
      out |= uint96(_time[i]) << 64;
      out |= uint96(_odds[i]) << 32;
      out |= uint96(g);
      outv[i] = out;
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
      require(_odds[i] > 125 && _odds[i] < 2000);
      f = 1e6 / (41 + _odds[i]) - 41;
      out |= uint64(_odds[i]) << 32;
      out |= uint64(f);
      outv[i] = out;
      delete out;
    }
  }
}
