/**
SPDX-License-Identifier: MIT License
@author Eric Falkenstein
*/
/*
settle() timestamp > weekOver
post() hourOfDay disabled on testnet
*/
pragma solidity ^0.8.0;

import "./Token.sol";
import "./Betting.sol";
import "./ConstantsOracle.sol";

contract Oracle {
  // results refer to match result; 0 for team 0 win, 1 for team 1 winning,
  // 2 for a tie or no contest
  uint8[32] public propResults;
  // prevents illogical sequences of transactions, such as sending an update after a settlement
  uint8 public reviewStatus;
  // gross decimal odd, eg 909 --> 1.909
  uint16[32] public propOdds;
  // incremented by one each settlement
  uint16 public betEpochOracle;
  // each data submission gets a new propNumber
  uint16 public propNumber;
  // 0 yes votes, 1 no votes
  uint32[2] public votes;
  // next Friday 8pm ET. No odds updates allowed after gameStart
  // no settlement submission for 2 days after gamestart
  uint32 public gameStart;
  //   0 total tokens in Oracle, 1 sum of avaxRevenue/tokens used tracking token accruals
  uint64[2] public feeData;
  // start times in UTC (aka GMT, Zulu time)
  uint32[32] public propStartTimes;
  // keeps track of  who supplied data proposal, who will be fined if data submission voted down
  address public proposer;
  /** the schedule is a record of "sport:initialFavorite:InitialUnderdog", 
  such as "NFL:Giants:Bears" for us football
   */
  string[32] public matchSchedule;
  // track token holders: ownership metric, whether they voted, their basis for the token fees
  mapping(address => AdminStruct) public adminStruct;
  // this allows the contract to send, receive and burn oracle tokens
  Token public token;
  // link to communicate with the betting contract
  Betting public bettingContract;

  struct AdminStruct {
    uint16 basePropNumber;
    uint16 baseEpoch;
    uint16 voteTracker;
    uint16 totalVotes;
    uint32 tokens;
    uint64 initFeePool;
  }

  event DecOddsPosted(uint16 epoch, uint16 propnum, uint16[32] decOdds);

  event Funding(
    uint32 tokensChange,
    uint256 etherChange,
    address transactor,
    bool withdrawal
  );

  event BetDataPosted(uint16 epoch, uint16 propnum, uint32[32] oddsStart);

  event ParamsPosted(uint32 concLimit);

  event PausePosted(uint8 pausedMatch0, uint8 pausedMatch1);

  event ResultsPosted(uint16 epoch, uint16 propnum, uint8[32] winner);

  event StartTimesPosted(uint16 epoch, uint16 propnum, uint32[32] starttimes);

  event SchedulePosted(uint16 epoch, uint16 propnum, string[32] sched);

  event TokenReward(address liqprovider, uint64 tokens, uint64 epoch);

  event VoteOutcome(
    bool voteResult,
    uint16 propnum,
    uint16 epoch,
    uint32 yesvotes,
    uint32 novotes
  );

  constructor(address payable bettingk, address payable _token) {
    bettingContract = Betting(bettingk);
    token = Token(_token);
    betEpochOracle = 1;
    propNumber = 1;
    reviewStatus = STATUS_POST_0;
  }

  receive() external payable {}

  /**  @dev votes on data submissions
   * @param  _vote is true for good/pass, false for bad/reject
   */
  function vote(bool _vote) external {
    require(adminStruct[msg.sender].tokens > 0);
    require(reviewStatus >= 10);
    require(adminStruct[msg.sender].voteTracker != propNumber);
    adminStruct[msg.sender].voteTracker = propNumber;
    if (_vote) {
      votes[0] += adminStruct[msg.sender].tokens;
    } else {
      votes[1] += adminStruct[msg.sender].tokens;
    }
    adminStruct[msg.sender].totalVotes++;
  }

  /**  @dev set of three arrays for initial betting slate
   * @param  _teamsched is 'sport:favorite:underdog' in a text string
   * @param _starts is the UTC start time
   * @param _decimalOdds odds is the gross decimial odds for the favorite
   * the decimal oodds are peculiar, in that first, the are 'decOdds -1)*1000
   * They are also 'grossed up' to anticipate the oracle fee of 5% applied to
   * the winnings
   */
  function initPost(
    string[32] memory _teamsched,
    uint32[32] memory _starts,
    uint16[32] memory _decimalOdds
  ) external {
    require(reviewStatus == STATUS_POST_0, "WRONG ORDER");
    uint32 _blocktime = uint32(block.timestamp);
    gameStart = _blocktime - ((_blocktime - 1687561200) % 604800) + 604800;
    for (uint256 i = 0; i < 32; i++) {
      require(
        _decimalOdds[i] < MAX_DEC_ODDS_INIT &&
          _decimalOdds[i] > MIN_DEC_ODDS_INIT,
        "odds outside range"
      );
      // require(
      //   (_starts[i] - _blocktime) < 604800 && (_starts[i] > gameStart),
      //   "starttime error"
      // );
    }
    propOdds = _decimalOdds;
    propStartTimes = _starts;
    matchSchedule = _teamsched;
    post();
    emit SchedulePosted(betEpochOracle, propNumber, _teamsched);
    emit StartTimesPosted(betEpochOracle, propNumber, _starts);
    emit DecOddsPosted(betEpochOracle, propNumber, _decimalOdds);
    reviewStatus = STATUS_PROC_INIT;
  }

  /**  @dev updates odds previously sent
   * @param _decimalOdds odds is the gross decimal odds for the favorite
   * described above
   */
  function updatePost(uint16[32] memory _decimalOdds) external {
    // require(gameStart > block.timestamp, "too late");
    for (uint256 i = 0; i < 32; i++) {
      require(
        _decimalOdds[i] < MAX_DEC_ODDS_UPDATE &&
          _decimalOdds[i] > MIN_DEC_ODDS_UPDATE
      );
    }
    post();
    require(reviewStatus == STATUS_POST_2, "wrong sequence");
    propOdds = _decimalOdds;
    emit DecOddsPosted(betEpochOracle, propNumber, _decimalOdds);
    reviewStatus = STATUS_PROC_UPDATE;
  }

  /**  @dev settle that weeks events by sending outcomes of matches
   *  odds previously sent
   * @param _resultVector are 0 for favorite winning, 1 for dog winning
   * 2 for a tie or no contest
   */
  function settlePost(uint8[32] memory _resultVector) external returns (bool) {
    require(reviewStatus == STATUS_POST_2, "wrong sequence");
    // require(
    //   block.timestamp > (gameStart + 2 * 86400),
    //   "only when weekend over"
    // );
    post();
    propResults = _resultVector;
    emit ResultsPosted(betEpochOracle, propNumber, _resultVector);
    reviewStatus = STATUS_PROC_SETTLE;
    return true;
  }

  /**  @dev A single function processes any of the three data submissions
   * if the vote is favorable, the data are sent to the betting contract
   * if the vote rejects, it does not affect the betting contract
   */
  function processVote() external {
    //require(hourOfDay() < HOUR_POST, "too soon");
    require(reviewStatus >= 10, "wrong sequence");
    bool successBool;
    if (reviewStatus == STATUS_PROC_INIT) {
      reviewStatus = STATUS_POST_0;
      if (votes[0] > votes[1]) {
        successBool = bettingContract.transmitInit(propOdds, propStartTimes);
        if (successBool) reviewStatus = STATUS_POST_2;
      } else {
        burn();
      }
    } else if (reviewStatus == STATUS_PROC_UPDATE) {
      reviewStatus = STATUS_POST_2;
      if (votes[0] > votes[1]) {
        bettingContract.transmitUpdate(propOdds);
      } else {
        burn();
      }
    } else {
      reviewStatus = STATUS_POST_2;
      if (votes[0] > votes[1]) {
        (
          bool successBool2,
          uint32 _betEpochOracle,
          uint256 ethDividend
        ) = bettingContract.settle(propResults);
        betEpochOracle = uint16(_betEpochOracle);
        feeData[1] += uint64(ethDividend / uint256(feeData[0]));
        if (successBool2) reviewStatus = STATUS_POST_0;
      } else {
        burn();
      }
    }
    emit VoteOutcome(
      successBool,
      betEpochOracle,
      propNumber,
      votes[0],
      votes[1]
    );
    reset();
  }

  /**  @dev this parameter allows the oracle to adjust how much diversification
   * is enforced. For example, with 32 events, and a concentration limite of 10,
   * and 15.0 avax supplied by the LPs, each event can handle up to 3.2 avax on
   * any single match. Its optimal setting will be discovered by experience.
   */
  function adjConcLimit(uint32 _concentrationLim) external returns (bool) {
    require(adminStruct[msg.sender].tokens >= MIN_SUBMIT);
    bettingContract.adjustConcentrationFactor(_concentrationLim);
    emit ParamsPosted(_concentrationLim);
    return true;
  }

  /**  @dev this stops new bets on particular events. It may never be used
   * but it does not add any risk, it just stops more exposure
   */
  function pauseMatches(uint8 _match0, uint8 _match1) external {
    require(adminStruct[msg.sender].tokens >= MIN_SUBMIT);
    bettingContract.pauseMatch(_match0, _match1);
    emit PausePosted(_match0, _match1);
  }

  /**  @dev token deposits for oracle
   * @param  _amt is the token amount deposited
   * it uses the token contract's exclusive transfer function for this
   * contract, and so does not require the standard approval function
   * it distributes accrued avax if there, as it has to reset the metric used
   * to calculate the fees/tokens relevant to this account's new token amount
   */
  function depositTokens(uint32 _amt) external {
    require(
      (_amt + adminStruct[msg.sender].tokens) > MIN_DEPOSIT &&
        (_amt + adminStruct[msg.sender].tokens) < MAX_DEPOSIT,
      "accounts restricted to between 40k and 140k"
    );
    bool success = token.tokenDeposit(msg.sender, uint256(_amt));
    require(success, "token transfer failed");
    uint256 _ethOut2;
    feeData[0] += _amt;
    if (
      adminStruct[msg.sender].tokens > 0 &&
      betEpochOracle > adminStruct[msg.sender].baseEpoch
    ) {
      _ethOut2 = ethClaim();
    }
    adminStruct[msg.sender].initFeePool = feeData[1];
    adminStruct[msg.sender].tokens += _amt;
    adminStruct[msg.sender].baseEpoch = betEpochOracle;
    adminStruct[msg.sender].totalVotes = 0;
    adminStruct[msg.sender].basePropNumber = propNumber;
    emit Funding(_amt, _ethOut2, msg.sender, false);
  }

  /**  @dev token holder withdrawals
   * @param  _amt is the token amount withdrawn
   * it also sends accrued avax, and resets the account
   */
  function withdrawTokens(uint32 _amt) external {
    require(_amt <= adminStruct[msg.sender].tokens, "nsf tokens");
    require(reviewStatus < 10, "no wd during vote");
    //require(adminStruct[msg.sender].baseEpoch < betEpochOracle, "too soon");
    feeData[0] -= _amt;
    uint256 _ethOut1 = ethClaim();
    adminStruct[msg.sender].initFeePool = feeData[1];
    adminStruct[msg.sender].tokens -= _amt;
    adminStruct[msg.sender].baseEpoch = betEpochOracle;
    adminStruct[msg.sender].totalVotes = 0;
    adminStruct[msg.sender].basePropNumber = propNumber;
    bool success = token.transfer(msg.sender, uint256(_amt));
    require(success, "token transfer failed");
    emit Funding(_amt, _ethOut1, msg.sender, true);
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

  /**  @dev internal function applying standard logic to all data posts
   */
  function post() internal {
    //require(hourOfDay() == HOUR_POST, "wrong hour");
    uint32 _tokens = adminStruct[msg.sender].tokens;
    require(_tokens >= MIN_SUBMIT, "Need 10% of tokens");
    votes[0] = _tokens;
    proposer = msg.sender;
    adminStruct[msg.sender].totalVotes++;
    adminStruct[msg.sender].voteTracker = propNumber;
  }

  /**  @dev internal function that calculates and sends the account's accrued
   * avax
   */
  function ethClaim() internal returns (uint256 _ethOut0) {
    uint256 votePercentx10000 = (uint256(adminStruct[msg.sender].totalVotes) *
      10000) / uint256(propNumber - adminStruct[msg.sender].basePropNumber);
    if (votePercentx10000 > 10000) votePercentx10000 = 10000;
    uint256 ethTot = uint256(adminStruct[msg.sender].tokens) *
      uint256(feeData[1] - adminStruct[msg.sender].initFeePool);
    _ethOut0 = (votePercentx10000 * ethTot) / 10000;
    uint256 ploughBack = ethTot - _ethOut0;
    feeData[1] += uint64(ploughBack / uint256(feeData[0]));
    payable(msg.sender).transfer(_ethOut0);
  }

  /**  @dev internal function that resets the account after a vote process
   */
  function reset() internal {
    propNumber++;
    votes[0] = 0;
    votes[1] = 0;
  }

  /**  @dev internal function that punishes proposers for bad data
   */
  function burn() internal {
    feeData[0] -= BURN_AMT;
    adminStruct[proposer].tokens -= BURN_AMT;
    token.transfer(address(0), uint256(BURN_AMT));
  }

  /**  @dev internal function that calculates GMT hour
   * used to restrict timing of data submissions and votes
   */
  function hourOfDay() public view returns (uint256 hour) {
    hour = (block.timestamp % 86400) / 3600;
  }
}
