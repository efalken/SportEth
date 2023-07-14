// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "./Betting.sol";
import "./ConstantsOracle.sol";

contract Oracle {
  // results are 0 for team 0   winning, 1 for team 1 winning, 2 for a tie or no contest
  uint8[32] public propResults;
  // slots are 0 for the initial favorite, 1 for initial underdog
  uint16[32] public propOdds;
  // slots are 0 for the initial favorite, 1 for initial underdog
  uint32[32] public propStartTimes;
  uint32 public betEpochOracle;
  uint32 public reviewStatus;
  uint32 public propNumber;
  // smaller data from propOddsStarts because one cannot change the start times
  //uint64[32] public propOddsUpdate;
  // uint32 public totVote;
  uint64 public tokensInContract;

  // 0 yes votes, 1 no votes, epoch, reviewStatus, propNumber,
  uint64[2] public votes;
  //   0 total equity Tokens in Oracle, 1 feesPerLiqTracker
  uint64[2] public feeData;
  // keeps track of  who supplied data proposal, will be fined if data submission voted down
  address public proposer;
  /** the schedule is a record of "sport:home:away", such as "NFL:NYG:SF" for us football
   */
  string[32] public matchSchedule;
  //uint64 public moose;
  // track token holders: ownership metric, whether they voted, their basis for the token fees
  mapping(address => AdminStruct) public adminStruct;
  mapping(address => uint32) public claimEpoch;
  // this allows the contract to send the tokens
  Token public token;
  // link to communicate with the betting contract
  Betting public bettingContract;

  struct AdminStruct {
    uint32 initEpoch;
    uint64 tokens;
    uint64 totalVotes;
    uint64 voteTracker;
    uint64 initFeePool;
  }

  event ResultsPosted(uint32 epoch, uint32 propnum, uint8[32] winner);

  event DecOddsPosted(uint32 epoch, uint32 propnum, uint16[32] decOdds);

  event VoteOutcome(
    bool voteResult,
    uint32 propnum,
    uint32 epoch,
    uint64 yesvotes,
    uint64 novotes
  );

  event BetDataPosted(uint32 epoch, uint32 propnum, uint32[32] oddsStart);

  event ParamsPosted(uint32 concLimit);

  event PausePosted(uint8[2] pausedMatches);

  event StartTimesPosted(uint32 propnum, uint32 epoch, uint32[32] starttimes);

  event SchedulePosted(uint32 epoch, uint32 propnum, string[32] sched);

  event Funding(
    uint64 tokensChange,
    uint256 etherChange,
    address transactor,
    bool withdrawal
  );

  event TokenReward(address liqprovider, uint64 tokens, uint64 epoch);

  constructor(address payable bettingk, address payable _token) {
    bettingContract = Betting(bettingk);
    token = Token(_token);
    // set initial bet epoch to 1
    betEpochOracle = 1;
    // sets initial proposal nonce to 1
    propNumber = 1;
    tokensInContract = 4e6;
    reviewStatus = ACTIVE_STATE0;
  }

  function vote(bool _vote) external {
    // voter must have votes to allocate
    require(adminStruct[msg.sender].tokens > 0);
    // can only vote if there is a proposal
    require(reviewStatus >= 10);
    // voter must not have voted on this proposal
    require(adminStruct[msg.sender].voteTracker != propNumber);
    // this prevents this account from voting again on this data proposal
    adminStruct[msg.sender].voteTracker = propNumber;
    // votes are simply one's entire token balance in this oracle contract
    uint64 _tokens = adminStruct[msg.sender].tokens;
    if (_vote) {
      votes[0] += _tokens;
    } else {
      votes[1] += _tokens;
    }
    adminStruct[msg.sender].totalVotes += (_tokens / 2);
  }

  receive() external payable {}

  function initPost(
    string[32] memory _teamsched,
    uint32[32] memory _starts,
    uint16[32] memory _decimalOdds
  ) external {
    // this requirement makes sure a post occurs only if there is not a current post under consideration
    require(reviewStatus == ACTIVE_STATE0, "Already under Review");
    for (uint256 i = 0; i < 32; i++) {
      uint realOdds = _decimalOdds[i] % 10000;
      require(realOdds < 1000);
    }
    // require((_starts[0] - block.timestamp) < 604800 && (_starts[0] - block.timestamp) > 86400);
    propOdds = _decimalOdds;
    propStartTimes = _starts;
    post();
    matchSchedule = _teamsched;
    // this tells users that an initial proposal has been sent
    emit SchedulePosted(betEpochOracle, propNumber, _teamsched);
    emit StartTimesPosted(betEpochOracle, propNumber, _starts);
    emit DecOddsPosted(betEpochOracle, propNumber, _decimalOdds);
    // set sequencer to 10, only initProcess can function next
    reviewStatus = INIT_PROC_NEXT;
    // moose = propOddsStarts[1];
  }

  function initProcess() external returns (bool) {
    // requires new init data posted
    require(reviewStatus == INIT_PROC_NEXT, "wrong data");
    // can only send after 12 noon GMT
    require(hourOfDay() < HOUR_PROCESS, "too soon");
    // only sent if 'null' vote does not win
    if (votes[0] > votes[1]) {
      // sends to the betting contract
      bettingContract.transmitInit(propOdds, propStartTimes);
      emit VoteOutcome(true, betEpochOracle, propNumber, votes[0], votes[1]);
      mintReward();
    } else {
      burnAndReset();
    }
    //totVote = votes[0] + votes[1];
    reset();
    // only update or settle allowed next
    reviewStatus = ACTIVE_STATE;
    return true;
  }

  function updatePost(uint16[32] memory _decimalOdds) external {
    require(reviewStatus == ACTIVE_STATE, "wrong sequence");
    post();
    for (uint256 i = 0; i < 32; i++) {
      uint realOdds = _decimalOdds[i] % 10000;
      require(realOdds < 1500);
    }
    emit DecOddsPosted(betEpochOracle, propNumber, _decimalOdds);
    reviewStatus = UPDATE_PROC_NEXT;
  }

  function updateProcess() external returns (bool) {
    // makes sure updated odds data was posted
    require(reviewStatus == UPDATE_PROC_NEXT, "wrong data");
    // needs at least 6 hours
    require(hourOfDay() < HOUR_PROCESS, "too soon");
    if (votes[0] > votes[1]) {
      bettingContract.transmitUpdate(propOdds);
      emit VoteOutcome(true, betEpochOracle, propNumber, votes[0], votes[1]);
      mintReward();
    } else {
      burnAndReset();
    }
    reset();
    reviewStatus = ACTIVE_STATE;
    return true;
  }

  function settlePost(uint8[32] memory _resultVector) external returns (bool) {
    // this makes sure init odds and time data are present
    require(reviewStatus == ACTIVE_STATE, "wrong sequence");
    uint weekOver = propStartTimes[0] -
      ((propStartTimes[0] - 1687564800) % 604800) +
      2 *
      86400;
    //require(block.timestamp > weekOver, "only when weekend over");
    post();
    propResults = _resultVector;
    emit ResultsPosted(betEpochOracle, propNumber, _resultVector);
    reviewStatus = SETTLE_PROC_NEXT;
    return true;
  }

  function settleProcess() external returns (bool) {
    require(reviewStatus == SETTLE_PROC_NEXT, "wrong data");
    require(hourOfDay() < HOUR_PROCESS, "too soon");
    // totVote = votes[0] + votes[1];
    if (votes[0] > votes[1]) {
      (uint32 xx, uint256 ethDividend) = bettingContract.settle(propResults);
      betEpochOracle = xx;
      feeData[1] += uint64(ethDividend / uint256(feeData[0]) / 1e5);
      emit VoteOutcome(true, betEpochOracle, propNumber, votes[0], votes[1]);
      mintReward();
    } else {
      burnAndReset();
    }
    reset();
    reviewStatus = 0;

    return true;
  }

  function concentrationFactor(
    uint32 _concentrationLim
  ) external returns (bool) {
    require(adminStruct[msg.sender].tokens >= (MIN_SUBMIT * 2));
    bettingContract.adjustParams(_concentrationLim);
    emit ParamsPosted(_concentrationLim);
    return true;
  }

  function pauseMatches(uint8[2] memory _matches) external {
    // submitter must have at least 10% of outstanding tokens for this emergency function
    require(adminStruct[msg.sender].tokens >= (MIN_SUBMIT * 2));
    bettingContract.pauseMatch(_matches);
    emit PausePosted(_matches);
  }

  function showSchedString() external view returns (string[32] memory) {
    return matchSchedule;
  }

  function depositTokens(uint32 _amt) external {
    uint256 _ethOut;
    feeData[0] += _amt;
    if (adminStruct[msg.sender].tokens > 0) {
      _ethOut = adjustFeeData();
    }
    adminStruct[msg.sender].initFeePool = feeData[1];
    adminStruct[msg.sender].tokens += _amt;
    adminStruct[msg.sender].initEpoch = betEpochOracle;
    adminStruct[msg.sender].totalVotes = adminStruct[msg.sender].tokens / 2;
    bool success = token.transferSpecial(msg.sender, _amt);
    require(success, "token transfer failed");
    emit Funding(_amt, _ethOut, msg.sender, true);
  }

  function withdrawTokens(uint64 _amt) external {
    require(_amt <= adminStruct[msg.sender].tokens, "nsf tokens");
    require(reviewStatus < 10, "no wd during vote");
    feeData[0] -= _amt;
    uint256 _ethOut = adjustFeeData();
    adminStruct[msg.sender].initFeePool = feeData[1];
    adminStruct[msg.sender].tokens -= uint32(_amt);
    adminStruct[msg.sender].initEpoch = betEpochOracle;
    adminStruct[msg.sender].totalVotes = adminStruct[msg.sender].tokens / 2;
    bool success = token.transfer(msg.sender, _amt);
    require(success, "token transfer failed");
    emit Funding(_amt, _ethOut, msg.sender, false);
  }

  // function tokenReward() external {
  //   require(tokensInContract > 0, "no token rewards left");
  //   (uint256 lpShares, ) = bettingContract.lpStruct(msg.sender);
  //   require(lpShares > 0, "only for liq providers");
  //   uint32 lpepoch = claimEpoch[msg.sender];
  //   uint32 epoch = bettingContract.params(0);
  //   if (lpepoch < (betEpochOracle - 1) && lpepoch != 0) {
  //     uint256 totShares = uint256(bettingContract.margin(3));
  //     uint64 tokenRewards = uint64(
  //       (uint256(lpShares) * EPOCH_AMOUNT) / totShares
  //     );
  //   tokensInContract -= uint32(tokenRewards);
  //   uint256 _ethOut;
  //   feeData[0] += tokenRewards;
  //   if (adminStruct[msg.sender].tokens > 0)
  //     { _ethOut = adjustFeeData();
  //     }
  //   adminStruct[msg.sender].initFeePool = feeData[1];
  //   adminStruct[msg.sender].tokens += uint32(tokenRewards);
  //   adminStruct[msg.sender].initEpoch = betEpochOracle + 1;
  //   adminStruct[msg.sender].totalVotes = adminStruct[msg.sender].tokens / 2;
  //   emit TokenReward(msg.sender, tokenRewards, epoch);
  //   }
  //   claimEpoch[msg.sender] = betEpochOracle;
  // }

  function post() internal {
    // ********* TAKE OUT IN PRODUCTION *****************************
    // require(hourOfDay() == HOUR_POST, "wrong hour");
    // this ensures only significant token holders are making proposals, blocks trolls
    require(adminStruct[msg.sender].tokens >= MIN_SUBMIT, "Need 10% of tokens");
    uint64 _tokens = adminStruct[msg.sender].tokens;
    votes[0] = _tokens;
    proposer = msg.sender;
    // this prevents proposer from voting again with his tokens on this submission
    adminStruct[msg.sender].voteTracker = propNumber;
    adminStruct[msg.sender].totalVotes += (_tokens / 2);
  }

  function reset() internal {
    // adds to nonce tracking proposals
    propNumber++;
    // resets votes count to zero
    votes[0] = 0;
    votes[1] = 0;
  }

  function burnAndReset() internal returns (bool success) {
    // punishes proposer for sending data that was rejected
    feeData[0] -= BURN_AMT;
    adminStruct[proposer].tokens -= BURN_AMT;
    success = token.burn(BURN_AMT);
    emit VoteOutcome(false, betEpochOracle, propNumber, votes[0], votes[1]);
    require(success, "token burn failed");
  }

  function showOdds() external view returns (uint16[32] memory _propOdds) {
    _propOdds = propOdds;
  }

  function showStarts() external view returns (uint32[32] memory _propStarts) {
    _propStarts = propStartTimes;
  }

  function showResults() external view returns (uint8[32] memory _propResults) {
    _propResults = propResults;
  }

  function mintReward() internal {
    // token.mint(proposer, ORACLE_REWARD);
  }

  function adjustFeeData() internal returns (uint256) {
    uint256 voteRecord = uint256(
      adminStruct[msg.sender].totalVotes /
        (betEpochOracle - adminStruct[msg.sender].initEpoch)
    );
    if (voteRecord > adminStruct[msg.sender].tokens) {
      voteRecord = adminStruct[msg.sender].tokens;
    }
    uint256 ethTot = uint256(
      adminStruct[msg.sender].tokens *
        (feeData[1] - adminStruct[msg.sender].initFeePool)
    ) * TOKEN_ADJ;
    uint256 _ethOut = (voteRecord * ethTot) / adminStruct[msg.sender].tokens;
    uint256 ploughBack = ethTot - _ethOut;
    feeData[1] += uint64(ploughBack / uint256(feeData[0]) / 1e5);
    (bool success, ) = payable(msg.sender).call{value: _ethOut}("");
    require(success, "eth payment failed");
    return _ethOut;
  }

  function hourOfDay() public view returns (uint256 hour) {
    // 86400 is seconds in a day, 3600 seconds in an hour
    hour = (block.timestamp % 86400) / 3600;
  }
}
