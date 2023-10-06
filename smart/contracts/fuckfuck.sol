/**
SPDX-License-Identifier: MIT License
@author Eric G Falkenstein
*/
pragma solidity 0.8.19;

import "./ConstantsOracle.sol";

contract fuckfuck {
  // true means odds were last submission, false implies settle&init last
  bool public reviewStatus;
  // tracks whether voting active, allows corrective replacement submissions
  uint8 public subNumber;
  // incremented by one each settlement
  uint32 public oracleEpoch;
  // each data submission gets a new propNumber
  uint32 public propNumber;
  // 0 yes votes, 1 no votes
  uint32[2] public votes;
  // next Friday 6pm ET. no settlement submission for 2 days after gamestart
  uint32 public gamesStart;
  //   total tokens deposited
  uint64 public totalTokens;
  // sum of avax revenue/totalTokens
  uint64 public tokenRevTracker;
  // start times in GMT in UTC (aka Greenwich or Zulu time)
  // In ISO 8601 it is presented with a Z suffix
  uint32[32] public propStartTimes;
  // keeps track of  who supplied data proposal, accounts cannot submit consecutive proposals
  // results refer to match result; 0 for team 0 win, 1 for team 1 winning,
  // 2 for a tie or no contest
  uint8[32] public propResults;
  // gross decimal odd, eg even odds 957 => 1 + 0.95*957 => 1.909
  uint16[32] public propOdds;
  /** the schedule is a record of "sport:initialFavorite:InitialUnderdog", 
  such as "NFL:Giants:Bears" for us football
   */
  string[32] public matchSchedule;
  address public proposer;
  // track token holders: ownership metric, whether they voted, their basis for the token fees
  mapping(address => AdminStruct) public adminStruct;
  // this allows the contract to send and receive

  struct AdminStruct {
    uint32 basePropNumber;
    uint32 probation;
    uint32 voteTracker;
    uint32 totalVotes;
    uint32 tokens;
    uint64 initFeePool;
  }

  event DecOddsPosted(
    uint32 epoch,
    uint32 propnum,
    uint8 subNumber,
    uint16[32] decOdds,
    address msgsender
  );

  event Funding(
    uint32 epoch,
    uint32 tokensChange,
    bool withdrawal,
    uint256 etherChange,
    address transactor
  );

  event ParamsPosted(uint32 epoch, uint32 concLimit, address msgsender);

  event PausePosted(uint32 epoch, uint256 pausedMatch, address msgsender);

  event ResultsPosted(
    uint32 epoch,
    uint32 propnum,
    uint8 subNumber,
    uint8[32] winner,
    address msgsender
  );

  event SchedulePosted(
    uint32 epoch,
    uint32 propnum,
    uint8 subNumber,
    string[32] sched,
    address msgsender
  );

  event StartTimesPosted(
    uint32 epoch,
    uint32 propnum,
    uint8 subNumber,
    uint32[32] starttimes,
    address msgsender
  );

  event VoteOutcome(
    uint32 epoch,
    uint32 propnum,
    uint32 voteYes,
    uint32 votefail,
    address dataProposer
  );

  constructor(address payable bettingk, address payable _token) {
    oracleEpoch = 1;
    propNumber = 1;
    reviewStatus = true;
  }

  receive() external payable {}

  /**  @dev votes on data submissions
   * @param  _vote is true for good/pass, false for bad/reject
   */
  function vote(bool _vote) external {
    require(adminStruct[msg.sender].tokens > 0, "need tokens");
    require(subNumber > 0, "nothing to vote on");
    require(hourOfDay() > GMT_2, "need gmt hour > 2");
    require(adminStruct[msg.sender].voteTracker != propNumber, "only one vote");
    adminStruct[msg.sender].voteTracker = propNumber;
    if (_vote) {
      votes[0] += adminStruct[msg.sender].tokens;
    } else {
      votes[1] += adminStruct[msg.sender].tokens;
    }
    adminStruct[msg.sender].totalVotes++;
  }

  /**  @dev sends odds for weekend events
   * @param _decimalOdds odds is the gross decimial odds for the favorite
   * the decimal odds here are peculiar, in that first, the are
   * (decOdds -1)* 1000 They are also 'grossed up' to anticipate the
   * oracle fee of 5% applied to  the winnings. they are multiplied by
   * 10 to allow a mechanism to identify halted matches
   */
  function oddsPost(uint16[32] memory _decimalOdds) external {
    require(!reviewStatus, "WRONG ORDER");
    post();
    for (uint256 i = 0; i < 32; i++) {
      require(
        _decimalOdds[i] <= MAX_DEC_ODDS && _decimalOdds[i] >= MIN_DEC_ODDS,
        "bad odds"
      );
      propOdds[i] = _decimalOdds[i] * 10;
    }
    emit DecOddsPosted(
      oracleEpoch,
      propNumber,
      subNumber,
      _decimalOdds,
      msg.sender
    );
  }

  /**  @dev settle that weeks events by sending outcomes of matches
   *  odds previously sent
   * @param _resultVector are 0 for favorite winning, 1 for dog winning
   * 2 for a tie or no contest
   */
  function settleRefreshPost(
    uint8[32] memory _resultVector,
    string[32] memory _teamsched,
    uint32[32] memory _starts
  ) external returns (bool) {
    require(reviewStatus, "wrong sequence");
    uint32 _blocktime = uint32(block.timestamp);
    require(
      block.timestamp > uint256(gamesStart + SECONDS_TWO_DAYS),
      "only when weekend over"
    );
    gamesStart =
      _blocktime -
      ((_blocktime - FRIDAY_21_GMT) % SECONDS_IN_WEEK) +
      SECONDS_IN_WEEK;
    for (uint256 i = 0; i < 32; i++) {
      require(
        _starts[i] >= gamesStart &&
          _starts[i] < (gamesStart + SECONDS_FOUR_DAYS),
        "start time error"
      );
    }
    post();
    propStartTimes = _starts;
    matchSchedule = _teamsched;
    propResults = _resultVector;
    emit ResultsPosted(
      oracleEpoch,
      propNumber,
      subNumber,
      _resultVector,
      msg.sender
    );
    emit SchedulePosted(
      oracleEpoch + 1,
      propNumber,
      subNumber,
      _teamsched,
      msg.sender
    );
    emit StartTimesPosted(
      oracleEpoch + 1,
      propNumber,
      subNumber,
      _starts,
      msg.sender
    );
    return true;
  }

  /**  @dev A single function processes any of the three data submissions
   * if the vote is favorable, the data are sent to the betting contract
   * if the vote rejects, it does not affect the betting contract
   */
  function processVote() external {
    require(hourOfDay() >= GMT_15, "need gmt hour >= 15");
    require(subNumber > 0, "nothing to send");
    subNumber = 0;
    uint32 thisEpoch = oracleEpoch;
    if (votes[0] > votes[1]) {
      if (!reviewStatus) {
        reviewStatus = !reviewStatus;
      } else {
        tokenRevTracker += uint64(100 / uint256(totalTokens));
        reviewStatus = !reviewStatus;
      }
    } else {
      adminStruct[proposer].probation = propNumber + 3;
    }
    emit VoteOutcome(thisEpoch, propNumber, votes[0], votes[1], proposer);
    propNumber++;
    delete votes;
  }

  /**  @dev this parameter allows the oracle to adjust how much diversification
   * is enforced. For example, with 32 events, and a concentration limite of 10,
   * and 15.0 avax supplied by the LPs, each event can handle up to 3.2 avax on
   * any single match. Its optimal setting will be discovered by experience.
   */
  function adjConcLimit(uint32 _concentrationLim) external {
    require(adminStruct[msg.sender].tokens > 0, "need a balance");
    require(
      _concentrationLim >= 5 && _concentrationLim <= 32,
      "between 5 and 32"
    );
    require(propNumber > adminStruct[msg.sender].probation, "on probation");
    adminStruct[msg.sender].probation = propNumber;
    emit ParamsPosted(oracleEpoch, _concentrationLim, msg.sender);
  }

  /**  @dev this stops new bets on particular events. It may never be used
   * but it does not add any risk, it just stops more exposure
   * @param  _match is the event to either be halted or reactivated
   * if the current state is active it will be halted, and vice versa
   */
  function haltBetting(uint256 _match) external {
    require(adminStruct[msg.sender].tokens > 0, "need a balance");
    require(propNumber > adminStruct[msg.sender].probation, "on probation");
    adminStruct[msg.sender].probation = propNumber;
    emit PausePosted(oracleEpoch, _match, msg.sender);
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
    require(
      propNumber > adminStruct[msg.sender].probation,
      "still on probation"
    );
    require(hourOfDay() <= GMT_2, "need gmt hour <= 2");
    require(
      (subNumber == 0 && msg.sender != proposer) ||
        (subNumber > 0 && msg.sender == proposer) ||
        (adminStruct[msg.sender].tokens >= adminStruct[proposer].tokens),
      "no consecutive acct posting"
    );
    require(adminStruct[msg.sender].tokens > 0);
    votes[0] = adminStruct[msg.sender].tokens;
    proposer = msg.sender;
    if (subNumber == 0) {
      adminStruct[msg.sender].totalVotes++;
    }
    subNumber++;
    adminStruct[msg.sender].voteTracker = propNumber;
  }

  /**  @dev internal function that calculates and sends the account's accrued
   * avax to reset the account
   */
  function ethClaim() internal returns (uint256 _ethOut) {
    uint256 votePercentx10000 = (uint256(adminStruct[msg.sender].totalVotes) *
      10000) / uint256(propNumber - adminStruct[msg.sender].basePropNumber);
    if (votePercentx10000 > 10000) votePercentx10000 = 10000;
    uint256 ethTot = uint256(adminStruct[msg.sender].tokens) *
      uint256(tokenRevTracker - adminStruct[msg.sender].initFeePool);
    _ethOut = (votePercentx10000 * ethTot) / 10000;
    uint256 ploughBack = ethTot - _ethOut;
    if (totalTokens > 0) {
      tokenRevTracker += uint64(ploughBack / uint256(totalTokens));
    }
  }

  /**  @dev internal function that calculates GMT hour
   * used to restrict timing of data submissions and votes
   */
  function hourOfDay() public view returns (uint256 hour) {
    hour = (block.timestamp % SECONDS_IN_DAY) / SECONDS_IN_HOUR;
  }
}
