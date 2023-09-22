/**
SPDX-License-Identifier: MIT License
@author Eric Falkenstein
*/

pragma solidity 0.8.19;

import "./Token.sol";
import "./BettingFuji.sol";
import "./ConstantsOracle.sol";

contract OracleFuji {
  // prevents illogical sequences of data, eg initial slate after initial slate
  uint8 public reviewStatus;
  // makes possible 2 submissions each propNumber
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
  Token public token;
  // link to communicate with the betting contract
  BettingFuji public bettingContract;

  struct AdminStruct {
    uint32 basePropNumber;
    uint32 baseEpoch;
    uint32 voteTracker;
    uint32 totalVotes;
    uint32 tokens;
    uint64 initFeePool;
  }

  event DecOddsPosted(uint32 epoch, uint32 propnum, uint16[32] decOdds);

  event Funding(
    uint32 epoch,
    uint32 tokensChange,
    uint256 etherChange,
    address transactor,
    bool withdrawal
  );

  event ParamsPosted(uint32 epoch, uint32 concLimit);

  event PausePosted(uint32 epoch, uint256 pausedMatch);

  event ResultsPosted(uint32 epoch, uint32 propnum, uint8[32] winner);

  event SchedulePosted(uint32 epoch, uint32 propnum, string[32] sched);

  event StartTimesPosted(uint32 epoch, uint32 propnum, uint32[32] starttimes);

  event VoteOutcome(
    uint32 epoch,
    uint32 propnum,
    uint32 voteYes,
    uint32 votefail,
    address dataProposer
  );

  constructor(address payable bettingk, address payable _token) {
    bettingContract = BettingFuji(bettingk);
    token = Token(_token);
    oracleEpoch = 1;
    propNumber = 1;
    reviewStatus = STATUS_INIT;
  }

  receive() external payable {}

  /**  @dev votes on data submissions
   * @param  _vote is true for good/pass, false for bad/reject
   */
  function vote(bool _vote) external {
    require(adminStruct[msg.sender].tokens > 0, "need tokens");
    require(subNumber > 0, "nothing to vote on");
    require(adminStruct[msg.sender].voteTracker != propNumber, "only one vote");
    adminStruct[msg.sender].voteTracker = propNumber;
    if (_vote) {
      votes[0] += adminStruct[msg.sender].tokens;
    } else {
      votes[1] += adminStruct[msg.sender].tokens;
    }
    adminStruct[msg.sender].totalVotes++;
  }

  /**  @dev set of two arrays for initial betting slate
   * @param  _teamsched is 'sport:favorite:underdog' in a text string
   * @param _starts is the UTC start time
   */
  function initPost(
    string[32] memory _teamsched,
    uint32[32] memory _starts
  ) external {
    require(reviewStatus == STATUS_INIT && subNumber < 2, "WRONG ORDER");
    uint32 _blocktime = uint32(block.timestamp);
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
    propStartTimes = _starts;
    matchSchedule = _teamsched;
    post();
    subNumber += 1;
    emit SchedulePosted(oracleEpoch, propNumber, _teamsched);
    emit StartTimesPosted(oracleEpoch, propNumber, _starts);
  }

  /**  @dev sends odds for weekend events
  * @param _decimalOdds odds is the gross decimial odds for the favorite
   * the decimal odds here are peculiar, in that first, the are 
   * 'decOdds -1)* 1000 They are also 'grossed up' to anticipate the 
   oracle fee of 5% applied to  the winnings
   */
  function oddsPost(uint16[32] memory _decimalOdds) external {
    require(reviewStatus == STATUS_ODDS && subNumber < 2, "WRONG ORDER");
    post();
    for (uint256 i = 0; i < 32; i++) {
      require(
        _decimalOdds[i] < MAX_DEC_ODDS && _decimalOdds[i] > MIN_DEC_ODDS,
        "bad odds"
      );
      propOdds[i] = _decimalOdds[i] * 10;
    }
    emit DecOddsPosted(oracleEpoch, propNumber, _decimalOdds);
    subNumber += 1;
  }

  /**  @dev settle that weeks events by sending outcomes of matches
   *  odds previously sent
   * @param _resultVector are 0 for favorite winning, 1 for dog winning
   * 2 for a tie or no contest
   */
  function settlePost(uint8[32] memory _resultVector) external returns (bool) {
    require(reviewStatus == STATUS_SETTLE && subNumber < 2, "wrong sequence");
    // require(
    //   block.timestamp > uint256(gamesStart + SECONDS_TWO_DAYS),
    //   "only when weekend over"
    // );
    post();
    propResults = _resultVector;
    emit ResultsPosted(oracleEpoch, propNumber, _resultVector);
    subNumber += 1;
    return true;
  }

  /**  @dev A single function processes any of the three data submissions
   * if the vote is favorable, the data are sent to the betting contract
   * if the vote rejects, it does not affect the betting contract
   */
  function processVote() external {
    // require(
    //   hourOfDay() < HOUR_POST && hourOfDay() > HOUR_PROCESS,
    //   "need gmt hr>12"
    // );
    require(subNumber > 0, "nothing to send");
    subNumber = 0;
    if (votes[0] > votes[1]) {
      if (reviewStatus == STATUS_INIT) {
        bool success = bettingContract.transmitInit(propStartTimes);
        if (success) {
          reviewStatus = STATUS_ODDS;
        }
      } else if (reviewStatus == STATUS_ODDS) {
        bool success = bettingContract.transmitOdds(propOdds);
        if (success) {
          reviewStatus = STATUS_SETTLE;
        }
      } else {
        (uint32 _oracleEpoch, uint256 ethDividend) = bettingContract.settle(
          propResults
        );
        if (_oracleEpoch > 0) {
          reviewStatus = STATUS_INIT;
          oracleEpoch = _oracleEpoch;
          tokenRevTracker += uint64(ethDividend / uint256(totalTokens));
        }
      }
    }
    emit VoteOutcome(oracleEpoch, propNumber, votes[0], votes[1], proposer);
    propNumber++;
    delete votes;
  }

  /**  @dev this parameter allows the oracle to adjust how much diversification
   * is enforced. For example, with 32 events, and a concentration limite of 10,
   * and 15.0 avax supplied by the LPs, each event can handle up to 3.2 avax on
   * any single match. Its optimal setting will be discovered by experience.
   */
  function adjConcLimit(uint32 _concentrationLim) external returns (bool) {
    require(adminStruct[msg.sender].tokens >= MIN_SUBMIT);
    bettingContract.adjustConcentrationFactor(_concentrationLim);
    emit ParamsPosted(oracleEpoch, _concentrationLim);
    return true;
  }

  /**  @dev this stops new bets on particular events. It may never be used
   * but it does not add any risk, it just stops more exposure
   * @param  _match is the event to either be halted or reactivated
   * if the current state is active it will be halted, and vice versa
   */
  function haltUnhaltMatch(uint256 _match) external {
    require(adminStruct[msg.sender].tokens >= MIN_SUBMIT);
    bettingContract.pauseMatch(_match);
    emit PausePosted(oracleEpoch, _match);
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
      (_amt + adminStruct[msg.sender].tokens) >= MIN_TOKEN_DEPOSIT &&
        (_amt + adminStruct[msg.sender].tokens) <= MAX_TOKEN_DEPOSIT,
      "accounts restricted to between 50k and 150k"
    );
    bool success = token.transferFrom(msg.sender, address(this), uint256(_amt));
    require(success, "token transfer failed");
    uint256 _ethOutDeposit;
    totalTokens += uint64(_amt);
    if (
      adminStruct[msg.sender].tokens > 0 &&
      oracleEpoch > adminStruct[msg.sender].baseEpoch
    ) {
      _ethOutDeposit = ethClaim();
    }
    adminStruct[msg.sender].initFeePool = tokenRevTracker;
    adminStruct[msg.sender].tokens += _amt;
    adminStruct[msg.sender].baseEpoch = oracleEpoch;
    adminStruct[msg.sender].totalVotes = 0;
    adminStruct[msg.sender].basePropNumber = propNumber;
    payable(msg.sender).transfer(_ethOutDeposit);
    emit Funding(oracleEpoch, _amt, _ethOutDeposit, msg.sender, false);
  }

  /**  @dev token holder withdrawals
   * @param  _amt is the token amount withdrawn
   * it also sends accrued avax, and resets the account
   */
  function withdrawTokens(uint32 _amt) external {
    require(_amt <= adminStruct[msg.sender].tokens, "nsf tokens");
    require(subNumber == 0, "no wd during vote");
    require(
      (adminStruct[msg.sender].tokens - _amt >= MIN_TOKEN_DEPOSIT) ||
        (adminStruct[msg.sender].tokens == _amt),
      "accounts restricted to min 50k"
    );
    require(adminStruct[msg.sender].baseEpoch < oracleEpoch, "too soon");
    totalTokens -= uint64(_amt);
    uint256 _ethOutWd = ethClaim();
    adminStruct[msg.sender].initFeePool = tokenRevTracker;
    adminStruct[msg.sender].tokens -= _amt;
    adminStruct[msg.sender].baseEpoch = oracleEpoch;
    adminStruct[msg.sender].totalVotes = 0;
    adminStruct[msg.sender].basePropNumber = propNumber;
    bool success = token.transfer(msg.sender, uint256(_amt));
    require(success, "token transfer failed");
    payable(msg.sender).transfer(_ethOutWd);
    emit Funding(oracleEpoch, _amt, _ethOutWd, msg.sender, true);
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
    // require(hourOfDay() == (subNumber + HOUR_POST), "wrong hour");
    require(
      msg.sender != proposer || subNumber == 1,
      "no consecutive acct posting"
    );
    require(adminStruct[msg.sender].tokens > 0);
    uint32 _tokens = adminStruct[msg.sender].tokens;
    votes[0] = _tokens;
    proposer = msg.sender;
    adminStruct[msg.sender].totalVotes++;
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
