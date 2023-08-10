/**
SPDX-License-Identifier: WTFPL
@author Eric Falkenstein
settle() timestamp > weekOver
baseEpoch set to epoch at deposit/reward/withdrawal 
voteEpoch: 2 votes per week
post() hourOfDay
HOUR_PROCESS set to 12 in production
*/
pragma solidity ^0.8.0;

import "./Token.sol";
import "./Betting.sol";
import "./ConstantsOracle.sol";

contract Oracle {
  // results are 0 for team 0   winning, 1 for team 1 winning, 2 for a tie or no contest
  uint8[32] public propResults;
  uint8 public reviewStatus;
  // slots are 0 for the initial favorite, 1 for initial underdog
  uint16[32] public propOdds;
  uint16 public betEpochOracle;
  uint16 public propNumber;
  // smaller data from propOddsStarts because one cannot change the start times
  //uint64[32] public propOddsUpdate;
  // uint32 public totVote;
  uint32 public rewardTokensLeft;
  // 0 yes votes, 1 no votes
  uint32[2] public votes;
  uint32 public gameStart;
  uint32 public minSubmit;
  //   0 total equity Tokens in Oracle, 1 feesPerLiqTracker
  uint64[2] public feeData;
  uint256 public moose;
    // slots are 0 for the initial favorite, 1 for initial underdog
  uint32[32] public propStartTimes;
  // keeps track of  who supplied data proposal, will be fined if data submission voted down
  address public proposer;
  /** the schedule is a record of "sport:home:away", such as "NFL:NYG:SF" for us football
   */
  string[32] public matchSchedule;
  // track token holders: ownership metric, whether they voted, their basis for the token fees
  mapping(address => AdminStruct) public adminStruct;
  // this allows the contract to send the tokens
  Token public token;
  // link to communicate with the betting contract
  Betting public bettingContract;

  struct AdminStruct {
    uint16 baseEpoch;    // for rewards
    uint16 voteTracker;// propNumber
    uint32 tokens;
    uint32 totalVotes; // tokens x numberVotes
    uint64 initFeePool;
  }

  event ResultsPosted(uint16 epoch, uint16 propnum, uint8[32] winner);

  event DecOddsPosted(uint16 epoch, uint16 propnum, uint16[32] decOdds);

  event VoteOutcome(
    bool voteResult,
    uint16 propnum,
    uint16 epoch,
    uint32 yesvotes,
    uint32 novotes
  );

  event BetDataPosted(uint16 epoch, uint16 propnum, uint32[32] oddsStart);

  event ParamsPosted(uint32 concLimit);

  event PausePosted(uint8[2] pausedMatches);

  event StartTimesPosted(uint16 epoch, uint16 propnum, uint32[32] starttimes);

  event SchedulePosted(uint16 epoch, uint16 propnum, string[32] sched);

  event Funding(
    uint32 tokensChange,
    uint256 etherChange,
    address transactor,
    bool withdrawal
  );

  //event TokenReward(address liqprovider, uint64 tokens, uint64 epoch);

  constructor(address payable bettingk, address payable _token) {
    bettingContract = Betting(bettingk);
    token = Token(_token);
    // set initial bet epoch to 1
    betEpochOracle = 1;
    // sets initial proposal nonce to 1
    propNumber = 1;
    rewardTokensLeft = 4e8;
    reviewStatus = STATUS_POST_0;
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
    uint32 _tokens = adminStruct[msg.sender].tokens;
    if (_vote) {
      votes[0] += _tokens;
    } else {
      votes[1] += _tokens;
    }
    adminStruct[msg.sender].totalVotes += _tokens;
  }

  receive() external payable {}

  function initPost(
    string[32] memory _teamsched,
    uint32[32] memory _starts,
    uint16[32] memory _decimalOdds
  ) external {
    // this requirement makes sure a post occurs only if there is not a current post under consideration
    require(reviewStatus == STATUS_POST_0, "WRONG ORDER");
    for (uint256 i = 0; i < 32; i++) {
      require(_decimalOdds[i] < MAX_DEC_ODDS_INIT && _decimalOdds[i] > MIN_DEC_ODDS_INIT);
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
    // set sequencer to 10, only processVote can func tion next
    reviewStatus = STATUS_PROC_10;
  }

  function updatePost(uint16[32] memory _decimalOdds) external {
    for (uint256 i = 0; i < 32; i++) {
      require(_decimalOdds[i] < MAX_DEC_ODDS_UPDATE && _decimalOdds[i] > MIN_DEC_ODDS_UPDATE);
    }
    post();
    require(reviewStatus == STATUS_POST_2, "wrong sequence");
    require( gameStart > block.timestamp, "too late");
    propOdds = _decimalOdds;
    emit DecOddsPosted(betEpochOracle, propNumber, _decimalOdds);
    reviewStatus = STATUS_PROC_20;
  }

  function settlePost(uint8[32] memory _resultVector) external returns (bool) {
    // this makes sure init odds and time data are present
    require(reviewStatus == STATUS_POST_2, "wrong sequence");
    //require(block.timestamp > (gameStart + 2 * 86400), "only when weekend over");
    post();
    propResults = _resultVector;
    emit ResultsPosted(betEpochOracle, propNumber, _resultVector);
    reviewStatus = STATUS_PROC_30;
    return true;
  }

 function processVote() internal returns (bool) {
    // makes sure updated odds data was posted
    require(reviewStatus == STATUS_PROC_20, "wrong data");
    // needs at least 12 hours
     require(hourOfDay() < HOUR_PROCESS, "too soon");
    if (votes[0] > votes[1]) {
      bettingContract.transmitUpdate(propOdds);
      emit VoteOutcome(true, betEpochOracle, propNumber, votes[0], votes[1]);
    } else {
      burn();
    }
    reset();
    reviewStatus = STATUS_POST_2;
    return true;
  }

    function processVote() external returns (bool) {
    // requires new init data posted  
    require(reviewStatus == STATUS_PROC_10, "wrong data");
    // can only send after 12 noon GMT
    require(hourOfDay() < HOUR_PROCESS, "too soon");
    // only sent if 'null' vote does not win
    if (votes[0] > votes[1]) {
      // sends to the betting contract
      bettingContract.transmitInit(propOdds, propStartTimes);
      emit VoteOutcome(true, betEpochOracle, propNumber, votes[0], votes[1]); 
    gameStart = propStartTimes[0] - ((propStartTimes[0] - 1687564800) % 604800);
      reviewStatus = STATUS_POST_2;
    } else {
      burn();
      reviewStatus = STATUS_POST_0;
    }
    reset();
    // only update or settle allowed next  
    return true;
  }

  function processVote() external {
    require(reviewStatus == STATUS_PROC_30, "wrong data");
    // require(hourOfDay() < HOUR_PROCESS, "too soon");
    if (votes[0] > votes[1]) {
      (uint256 ethDividend) = bettingContract.settle(propResults);
      betEpochOracle++;
     feeData[1] += uint64(ethDividend/ uint256(feeData[0]));
      emit VoteOutcome(true, betEpochOracle, propNumber, votes[0], votes[1]);
      reviewStatus = STATUS_POST_0;
    } else {
      burn();
      reviewStatus = STATUS_POST_2;
    }
    reset();
  }

  function adjParams(
    uint32 _concentrationLim,
    uint32 _minSubmit
  ) external returns (bool) {
    require(adminStruct[msg.sender].tokens >= (minSubmit * 2));
    bettingContract.adjustParams(_concentrationLim);
    minSubmit = _minSubmit;
    emit ParamsPosted(_concentrationLim);
    return true;
  }

  function pauseMatches(uint8[2] memory _matches) external {
    // submitter must have at least 10% of outstanding tokens for this emergency function
    require(adminStruct[msg.sender].tokens >= (minSubmit * 2));
    bettingContract.pauseMatch(_matches);
    emit PausePosted(_matches);
  }

  function showSchedString() external view returns (string[32] memory) {
    return matchSchedule;
  }

    function showPropOdds() external view returns (uint16[32] memory) {
    return propOdds;
  }

    function showPropResults() external view returns (uint8[32] memory) {
    return propResults;
  }

    function showPropStartTimes() external view returns (uint32[32] memory) {
    return propStartTimes;
  }

  function depositTokens(uint32 _amt) external {
    uint256 _ethOut2;
    feeData[0] += _amt;
    if (adminStruct[msg.sender].tokens > 0) {
    _ethOut2 =  ethClaim(msg.sender);
    }
    adminStruct[msg.sender].initFeePool = feeData[1];
    adminStruct[msg.sender].tokens += _amt;
    adminStruct[msg.sender].baseEpoch = betEpochOracle;
    adminStruct[msg.sender].totalVotes = 0;
    bool success = token.transferSpecial(msg.sender, _amt);
    require(success, "token transfer failed");
    emit Funding(_amt, (_ethOut2 * 1e6), msg.sender, true);
  }

  function withdrawTokens(uint32 _amt) external {
    require(_amt <= adminStruct[msg.sender].tokens, "nsf tokens");
    require(reviewStatus < 10, "no wd during vote");
    require(adminStruct[msg.sender].baseEpoch < betEpochOracle, "too soon");
    feeData[0] -= _amt;
    uint256 _ethOut1 = ethClaim(msg.sender);
    adminStruct[msg.sender].initFeePool = feeData[1];
    adminStruct[msg.sender].tokens -= _amt;
    adminStruct[msg.sender].baseEpoch = betEpochOracle;
    adminStruct[msg.sender].totalVotes = 0;
    bool success = token.transfer(msg.sender, _amt);
    require(success, "token transfer failed");
    emit Funding(_amt, (_ethOut1 * 1e6), msg.sender, true);
  }

  function tokenReward() external {
    require(rewardTokensLeft > 0, "no token rewards left");
    (uint256 lpShares, ) = bettingContract.lpStruct(msg.sender);
    require(lpShares > 0, "only for liq providers");
    uint32 lpepoch = adminStruct[msg.sender].baseEpoch;
    uint32 _amt;
    uint256 _ethOut3;
    if (lpepoch == 0) {
      adminStruct[msg.sender].baseEpoch = betEpochOracle;
      adminStruct[msg.sender].initFeePool = 0;

     } else if (lpepoch < betEpochOracle) {
      uint256 totShares = uint256(bettingContract.margin(3));
       _amt = uint32(
        (uint256(lpShares) * EPOCH_AMOUNT) / totShares
      );
      rewardTokensLeft -= _amt;
      feeData[0] += _amt;
      if (adminStruct[msg.sender].tokens > 0)
        { _ethOut3 = ethClaim(msg.sender);
        }
      adminStruct[msg.sender].initFeePool = feeData[1];
      adminStruct[msg.sender].tokens += _amt;
      adminStruct[msg.sender].baseEpoch = betEpochOracle;
      adminStruct[msg.sender].totalVotes = 0;
    }
    emit Funding(_amt, (_ethOut3 * 1e6), msg.sender, true);
  }

  function post() internal {
    // ********* TAKE OUT IN PRODUCTION *****************************
     require(hourOfDay() == HOUR_POST, "wrong hour");
    // this ensures only significant token holders are making proposals, blocks trolls
    uint32 _tokens = adminStruct[msg.sender].tokens;
    require(_tokens >= minSubmit, "Need 10% of tokens");
    votes[0] = _tokens;
    proposer = msg.sender;
    // this prevents proposer from voting again with his tokens on this submission
    adminStruct[msg.sender].voteTracker = propNumber;
    adminStruct[msg.sender].totalVotes += _tokens;
  }

  function reset() internal {
    // adds to nonce tracking proposals
    propNumber++;
    // resets votes count to zero
    votes[0] = 0;
    votes[1] = 0;
  }

  function burn() internal returns (bool success) {
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

  function ethClaim(address msgsender) internal returns(uint256 _ethOut0){
    uint256 votesPerEpoch = uint256(
      adminStruct[msgsender].totalVotes /
        (betEpochOracle - adminStruct[msgsender].baseEpoch) / 2
    );
    uint256 userTokens = adminStruct[msgsender].tokens;
    if (votesPerEpoch > userTokens) {
      votesPerEpoch = userTokens;
    }
    uint256 ethTot = uint256(
      userTokens *
        uint256(feeData[1] - adminStruct[msgsender].initFeePool)
    );
    _ethOut0 = (votesPerEpoch * ethTot) / userTokens;
    uint256 ploughBack =  ethTot - _ethOut0;
    feeData[1] += uint64(ploughBack / uint256(feeData[0]));
    //(bool success, ) = payable(msgsender).call{value: (_ethOut0 * 1e6)}("");
    payable(msg.sender).transfer(_ethOut0 * 1e6);
    //require(success, "eth payment failed");
  }

// change to internal view in PROD
  function hourOfDay() public view returns (uint256 hour) {
    // 86400 is seconds in a day, 3600 seconds in an hour
    hour = (block.timestamp % 86400) / 3600;
  }
}
