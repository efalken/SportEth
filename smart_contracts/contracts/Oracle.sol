// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "./Betting.sol";
import "./ConstantsOracle.sol";

contract Oracle {
  // slots are 0 for the initial favorite, 1 for initial underdog
  uint96[32] public propOddsStarts;
  // smaller data from propOddsStarts because one cannot change the start times
  uint64[32] public propOddsUpdate;
  uint64 public totVote;
  // results are 0 for team 0 winning, 1 for team 1 winning, 2 for a tie or no contest
  uint8[32] public propResults;
  /** the schedule is a record of "sport:home:away", such as "NFL:NYG:SF" for us football
   */
  string[32] public matchSchedule;
  //   0 total equity Tokens in Oracle, 1 feesPerLiqTracker
  uint64[2] public feeData;
  // 0 yes votes, 1 no votes
  uint64[2] public votes;
  // propStartTime in UTC is used to stop active betting. No bets are taken after this time.
  uint32 public betEpochOracle;
  uint32 public reviewStatus;
  uint32 public propNumber;
  // keeps track of  who supplied data proposal, will be fined if data submission voted down
  address public proposer;
  // track token holders: ownership metric, whether they voted, their basis for the token fees
  mapping(address => AdminStruct) public adminStruct;
  // this allows the contract to send the tokens
  Token public token;
  // link to communicate with the betting contract
  Betting public bettingContract;

  struct AdminStruct {
    uint64 tokens;
    uint64 initFeePool;
    uint64 totalVotes;
    uint32 voteTracker;
    uint32 initEpoch;
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
    // set initial bet epoch to 1
    betEpochOracle = 1;
    // sets initial proposal nonce to 1
    propNumber = 1;
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
    uint32[32] memory _decimalOdds
  ) external {
    // this requirement makes sure a post occurs only if there is not a current post under consideration
    require(reviewStatus == 0, "Already under Review");
    propOddsStarts = create96(_starts, _decimalOdds);
    post();
    matchSchedule = _teamsched;
    // this tells users that an initial proposal has been sent
    emit SchedulePosted(betEpochOracle, propNumber, _teamsched);
    emit StartTimesPosted(betEpochOracle, propNumber, _starts);
    emit DecOddsPosted(betEpochOracle, propNumber, _decimalOdds);
    // set sequencer to 10, only initProcess can function next
    reviewStatus = INIT_PROC_NEXT;
  }

  function initProcess() external returns (bool) {
    // requires new init data posted
    require(reviewStatus == INIT_PROC_NEXT, "wrong data");
    // can only send after 12 noon GMT
    require(hourOfDay() < HOUR_PROCESS, "too soon");
    // only sent if 'null' vote does not win
    if (votes[0] > votes[1]) {
      // sends to the betting contract
      bettingContract.transmitInit(propOddsStarts);
      emit VoteOutcome(true, betEpochOracle, propNumber, votes[0], votes[1]);
      mintReward();
    } else {
      burnAndReset();
    }
    totVote = votes[0] + votes[1];
    reset();
    // only update or settle allowed next
    reviewStatus = ACTIVE_STATE;
    return true;
  }

  function updatePost(uint32[32] memory _decimalOdds) external {
    require(reviewStatus == ACTIVE_STATE, "wrong sequence");
    post();
    propOddsUpdate = create64(_decimalOdds);
    emit DecOddsPosted(betEpochOracle, propNumber, _decimalOdds);
    reviewStatus = UPDATE_PROC_NEXT;
  }

  function updateProcess() external returns (bool) {
    // makes sure updated odds data was posted
    require(reviewStatus == UPDATE_PROC_NEXT, "wrong data");
    // needs at least 6 hours
    require(hourOfDay() < HOUR_PROCESS, "too soon");
    if (votes[0] > votes[1]) {
      bettingContract.transmitUpdate(propOddsUpdate);
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
    post();
    propResults = _resultVector;
    emit ResultsPosted(betEpochOracle, propNumber, _resultVector);
    reviewStatus = SETTLE_PROC_NEXT;
    return true;
  }

  function settleProcess() external returns (bool) {
    require(reviewStatus == SETTLE_PROC_NEXT, "wrong data");
    require(hourOfDay() < HOUR_PROCESS, "too soon");
    totVote = votes[0] + votes[1];
    if (votes[0] > votes[1]) {
      (uint32 _epoch, uint256 ethDividend) = bettingContract.settle(
        propResults
      );
      betEpochOracle = _epoch;
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

  function pauseMatches(uint8 _match1, uint8 _match2) external {
    // submitter must have at least 10% of outstanding tokens for this emergency function
    require(adminStruct[msg.sender].tokens >= (MIN_SUBMIT * 2));
    bettingContract.pauseMatch(_match1, _match2);
    emit PausePosted(_match1, _match2);
  }

  function showSchedString() external view returns (string[32] memory) {
    return matchSchedule;
  }

  function depositTokens(uint64 _amt) external {
    uint256 ethClaim;
    bool success;
    if (adminStruct[msg.sender].tokens > 0) {
      ethClaim =
        uint256(
          adminStruct[msg.sender].tokens *
            (feeData[1] - adminStruct[msg.sender].initFeePool)
        ) *
        TOKEN_ADJ;
      //payable(msg.sender).transfer(ethClaim);
      (success, ) = payable(msg.sender).call{value: ethClaim}("");
      require(success, "eth payment failed");
    }
    (success) = token.transferSpecial(msg.sender, _amt);
    require(success, "not success");
    adminStruct[msg.sender].initFeePool = feeData[1];
    adminStruct[msg.sender].tokens += _amt;
    adminStruct[msg.sender].initEpoch = betEpochOracle;
    feeData[0] += _amt;
    emit Funding(_amt, ethClaim, msg.sender);
  }

  function withdrawTokens(uint64 _amtTokens) external {
    require(_amtTokens <= adminStruct[msg.sender].tokens, "nsf tokens");
    // this prevents voting more than once or oracle proposals with token balance.
    require(reviewStatus == 2, "no wd during vote");
    uint64 numVotes = uint64(betEpochOracle - adminStruct[msg.sender].initEpoch);
    require(numVotes > 0, "no wd for at least 1 week");
    uint64 userVotes = (adminStruct[msg.sender].totalVotes + adminStruct[msg.sender].tokens) / numVotes;
    if (userVotes > adminStruct[msg.sender].tokens) {userVotes = adminStruct[msg.sender].tokens;}
    bool success;
    uint256 ethClaim = uint256(
      userVotes * 
        (feeData[1] - adminStruct[msg.sender].initFeePool)
    ) * TOKEN_ADJ; 
    adminStruct[msg.sender].initFeePool = feeData[1];
    feeData[0] -= _amtTokens;
    adminStruct[msg.sender].tokens -= _amtTokens;
    adminStruct[msg.sender].initEpoch = betEpochOracle;
    adminStruct[msg.sender].totalVotes = 0;
    //payable(msg.sender).transfer(ethClaim);
    (success, ) = payable(msg.sender).call{value: ethClaim}("");
    require(success, "eth payment failed");
    (success) = token.transfer(msg.sender, _amtTokens);
    require(success, "token failed");
    emit Funding(_amtTokens, ethClaim, msg.sender);
  }

  function post() internal {
    uint256 hour = hourOfDay();
    require(hour == HOUR_POST, "wrong hour");
    // this ensures only significant token holders are making proposals, blocks trolls
    require(adminStruct[msg.sender].tokens >= MIN_SUBMIT, "Need 5% of tokens");
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
    // resets yes vote count to zero
    votes[0] = 0;
    // resets no votes count to zero
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

  function mintReward() internal {
    // token.mint(proposer, ORACLE_REWARD);
  }

  function create96(
    uint32[32] memory _time,
    uint32[32] memory _odds
  ) internal pure returns (uint96[32] memory outv) {
    uint32 opponentOdds;
    uint96 out;
    for (uint256 i = 0; i < 32; i++) {
      if (_time[i] != 0) {
        require(_odds[i] > MIN_DEC_ODDS_INIT && _odds[i] < MAX_DEC_ODDS_INIT);
        require(_time[i] >= _time[0]);
        opponentOdds = 1e6 / (ODDS_FACTOR0 + _odds[i]) - ODDS_FACTOR1;
        out |= uint96(_time[i]) << 64;
        out |= uint96(_odds[i]) << 32;
        out |= uint96(opponentOdds);
        outv[i] = out;
      }
      delete out;
    }
  }

  function create64(
    uint32[32] memory _odds
  ) internal pure returns (uint64[32] memory outv) {
    uint32 opponentOdds;
    uint64 out;
    for (uint256 i = 0; i < 32; i++) {
      require(_odds[i] > MIN_DEC_ODDS_UPDATE && _odds[i] < MAX_DEC_ODDS_UPDATE);
      opponentOdds = 1e6 / (ODDS_FACTOR1 + _odds[i]) - ODDS_FACTOR1;
      out |= uint64(_odds[i]) << 32;
      out |= uint64(opponentOdds);
      outv[i] = out;
      delete out;
    }
  }

  function hourOfDay() internal view returns (uint256 hour) {
    // 86400 is seconds in a day, 3600 seconds in an hour
    hour = (block.timestamp % 86400) / 3600;
  }
}
