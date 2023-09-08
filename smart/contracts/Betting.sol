/**
SPDX-License-Identifier: MIT License
@author Eric Falkenstein
*/
pragma solidity 0.8.19;

import "./Token.sol";
import "./ConstantsBetting.sol";

contract Betting {
  /* ability to pause 2 matches if odds are extremely stale. 
  setting them to any number greater than 31 makes this emergency 
  parameter inactive */
  uint8[2] public paused;
  /* decimal odds for favorite, formatted as decimal odds minus one times 1000
  The payout must be multiplied by 95/100 to accommodate the oracle fee */
  uint16[32] public odds;
  //0 betEpoch, 1 concentration Limit, 2 nonce, 3 first Start Time
  uint32[4] public params;
  // UTC GMT aka Zulu time. In ISO 8601 it is presented with a Z suffix
  uint32[32] public startTime;
  // 0 total LPcapital, 1 LPcapitalLocked, 2 bettorLocked, 3 totalLPShares
  uint64[4] public margin;
  /* 0-betLong[favorite], 1-betLong[away], 2-betPayout[favorite], 3-betPayout[underdog]
  These data are bitpacked for efficiency */
  uint256[32] public betData;
  // the oracle contract as exclusive access to several functions
  address payable public oracleAdmin;
  /// for paying LP token Rewards
  Token public token;
  // individual bet contracts
  mapping(bytes32 => Subcontract) public betContracts;
  /* this maps the set {epoch, match, team} to its event outcome,
  via betTarget=epoch * 1000 + match * 10 + teamWinner. 
  For example, epoch 21, match 15, and team 0 wins, would be 21150 */
  mapping(uint32 => uint8) public outcomeMap;
  /// This keeps track of an LP's data
  mapping(address => LPStruct) public lpStruct;
  /* this struct holds a bettor's balance and unredeemed trades
  If an LP wants to bet, they will have an independent userStruct */
  mapping(address => UserStruct) public userStruct;

  struct Subcontract {
    uint32 epoch;
    uint32 matchNum;
    uint32 pick;
    uint64 betAmount;
    uint64 payoff;
    address bettor;
  }

  struct UserStruct {
    uint32 counter;
    uint64 userBalance;
    mapping(uint => bytes32) trades;
  }

  struct LPStruct {
    uint64 shares;
    uint32 outEpoch;
    uint32 claimEpoch;
  }

  event BetRecord(
    address indexed bettor,
    uint32 indexed epoch,
    uint32 matchNum,
    uint32 pick,
    uint64 betAmount,
    uint64 payoff,
    bytes32 contractHash
  );

  event Funding(
    address indexed bettor,
    uint32 epoch,
    uint256 cryptoMoved,
    uint256 action
  );

  constructor(address payable _tokenAddress) {
    params[1] = 5;
    params[0] = 1;
    params[3] = 2e9;
    token = Token(_tokenAddress);
  }

  /// @dev restricts data submissions to the Oracle contract

  modifier onlyAdmin() {
    require(oracleAdmin == msg.sender);
    _;
  }

  /**  @dev initial deployment sets administrator as the Oracle contract
  * @param  _oracleAddress is the only account that can process several transactions 
  in this contract
  */
  function setOracleAddress(address payable _oracleAddress) external {
    require(oracleAdmin == address(0), "Only once");
    oracleAdmin = _oracleAddress;
  }

  receive() external payable {}

  /** @dev processes a basic bet
   * @param _matchNumber is 0 to 31, representing the match number as presented in the sequence of weekly matches
   * @param _team0or1 denotes the initial favorite (0) and underdog (1) for a given epoch and matchNumber
   * @param _betAmt is the amount bet in 10s of finney  , 0.0001 ether
   */
  function bet(
    uint32 _matchNumber,
    uint32 _team0or1,
    int64 _betAmt
  ) external returns (bytes32) {
    require(userStruct[msg.sender].counter < 16, "betstack full, redeem bets");
    require(
      _betAmt <= int64(uint64(userStruct[msg.sender].userBalance)),
      "over capital balance"
    );
    require(_betAmt >= MIN_BET, "bets must be ge 1 avax");
    require(
      paused[0] != _matchNumber && paused[1] != _matchNumber,
      "match is paused"
    );
    require(startTime[_matchNumber] > block.timestamp, "game started");
    uint64[4] memory _betData = decodeNumber(_matchNumber);
    int64 betPayoff = int64(uint64(odds[_matchNumber]));
    if (_team0or1 == 0) {
      betPayoff = (_betAmt * betPayoff) / 1000;
    } else {
      betPayoff =
        (_betAmt * (1e6 / (betPayoff + ODDS_FACTOR) - ODDS_FACTOR)) /
        1000;
    }
    int64 currLpBetExposure = int64(_betData[2 + _team0or1]) -
      int64(_betData[1 - _team0or1]);
    require(
      int64(betPayoff + currLpBetExposure) <=
        int64(margin[0] / uint64(params[1])),
      "betsize over global book limit"
    );
    int64 currLpExposureOpp = int64(_betData[3 - _team0or1]) -
      int64(_betData[_team0or1]);
    int64 marginChange = maxZero(
      betPayoff + currLpBetExposure,
      -_betAmt + currLpExposureOpp
    ) - maxZero(currLpBetExposure, currLpExposureOpp);
    require(
      marginChange < int64(margin[0] - margin[1]),
      "betsize over available free capital"
    );
    userStruct[msg.sender].userBalance -= uint64(_betAmt);
    bytes32 subkID = keccak256(abi.encodePacked(params[2], block.number));
    Subcontract memory order;
    order.bettor = msg.sender;
    order.betAmount = uint64(_betAmt);
    order.payoff = uint64(betPayoff);
    order.pick = _team0or1;
    order.matchNum = _matchNumber;
    order.epoch = params[0];
    betContracts[subkID] = order;
    margin[2] += uint64(_betAmt);
    margin[1] = uint64(int64(margin[1]) + marginChange);
    _betData[0 + _team0or1] += uint64(_betAmt);
    _betData[2 + _team0or1] += uint64(betPayoff);
    uint256 encoded;
    encoded |= uint256(_betData[0]) << 192;
    encoded |= uint256(_betData[1]) << 128;
    encoded |= uint256(_betData[2]) << 64;
    encoded |= uint256(_betData[3]);
    betData[_matchNumber] = uint256(encoded);
    params[2]++;
    userStruct[msg.sender].trades[userStruct[msg.sender].counter] = subkID;
    userStruct[msg.sender].counter++;
    emit BetRecord(
      msg.sender,
      params[0],
      _matchNumber,
      _team0or1,
      uint32(int32(_betAmt)),
      uint32(int32((betPayoff * 95) / 100)),
      subkID
    );
    return subkID;
  }

  /// @dev bettor funds account for bets
  function fundBettor() external payable {
    uint64 amt = uint64(msg.value / UNITS_TRANS14);
    require(amt >= MIN_BET_DEPOSIT, "need at least one avax");
    userStruct[msg.sender].userBalance += amt;
    emit Funding(msg.sender, params[0], uint256(amt), 0);
  }

  /// @dev funds LP for supplying capital to take bets
  function fundBook() external payable {
    require(block.timestamp < params[3], "only prior to first event");
    uint256 netinvestment = (msg.value / UNITS_TRANS14);
    uint64 _shares = 0;
    require(netinvestment >= MIN_BET_DEPOSIT, "need at least one avax");
    if (margin[0] > 0) {
      _shares = uint64(
        (netinvestment * uint256(margin[3])) / uint256(margin[0])
      );
    } else {
      _shares = uint64(netinvestment);
    }
    margin[0] = margin[0] + uint64(netinvestment);
    lpStruct[msg.sender].outEpoch = params[0] + MIN_LP_DURATION;
    margin[3] += _shares;
    lpStruct[msg.sender].shares += _shares;
    emit Funding(msg.sender, params[0], netinvestment, 1);
  }

  /** @dev bettor withdrawal
   * @param _amt is the bettor amount where 10000 = 1 avax
   */
  function withdrawBettor(uint64 _amt) external {
    require(_amt <= userStruct[msg.sender].userBalance);
    userStruct[msg.sender].userBalance -= _amt;
    uint256 amt256 = uint256(_amt) * UNITS_TRANS14;
    payable(msg.sender).transfer(amt256);
    emit Funding(msg.sender, params[0], amt256, 2);
  }

  /** @dev processes withdrawal by LPs
   * @param _sharesToSell is the LP's ownership stake withdrawn.
   */
  function withdrawBook(uint64 _sharesToSell) external {
    require(block.timestamp < params[3], "only prior to first event");
    require(lpStruct[msg.sender].shares >= _sharesToSell, "NSF");
    require(params[0] > lpStruct[msg.sender].outEpoch, "too soon");
    uint64 ethWithdraw = (_sharesToSell * margin[0]) / margin[3];
    require(
      ethWithdraw <= (margin[0] - margin[1]),
      "insufficient free capital"
    );
    margin[3] -= _sharesToSell;
    lpStruct[msg.sender].shares -= _sharesToSell;
    margin[0] -= ethWithdraw;
    uint256 ethWithdrawWei = uint256(ethWithdraw) * UNITS_TRANS14;
    payable(msg.sender).transfer(ethWithdrawWei);
    emit Funding(msg.sender, params[0], ethWithdrawWei, 3);
  }

  /** @dev redeems users bet stack of unredeemed bets
   */

  function redeem() external {
    uint256 numberBets = userStruct[msg.sender].counter;
    require(numberBets > 0, "no bets");
    uint64 payout;
    for (uint256 i = 0; i < numberBets; i++) {
      bytes32 _subkId = userStruct[msg.sender].trades[i];
      if (betContracts[_subkId].epoch == params[0]) revert("bets active");
      uint32 epochMatch = betContracts[_subkId].epoch *
        1000 +
        betContracts[_subkId].matchNum *
        10 +
        betContracts[_subkId].pick;
      if (outcomeMap[epochMatch] != 0) {
        payout += betContracts[_subkId].betAmount;
        if (outcomeMap[epochMatch] == 2) {
          payout += (betContracts[_subkId].payoff * 95) / 100;
        }
      }
    }
    userStruct[msg.sender].counter = 0;
    userStruct[msg.sender].userBalance += payout;
    emit Funding(msg.sender, params[0], uint256(payout), 4);
  }

  /** @dev processes initial odds and start times
   * @param _odds is the epoch's set of odds and start times for matches.
   * @param _starts are the start times
   */
  function transmitInit(
    uint16[32] calldata _odds,
    uint32[32] calldata _starts
  ) external onlyAdmin returns (bool) {
    require(margin[2] == 0, "wrong order");
    startTime = _starts;
    odds = _odds;
    uint32 ts = uint32(block.timestamp);
    params[3] = ts - ((ts - FRIDAY_22_GMT) % WEEK_IN_SECONDS) + WEEK_IN_SECONDS;
    paused[0] = 99;
    paused[1] = 99;
    return true;
  }

  /** @dev processes updates to epoch's odds
   * @param _updateOdds updates the epoch's odds
   */
  function transmitUpdate(
    uint16[32] calldata _updateOdds
  ) external onlyAdmin returns (bool) {
    odds = _updateOdds;
    paused[0] = 99;
    paused[1] = 99;
    return true;
  }

  /**  @dev assigns results to matches, enabling withdrawal, removes capital for this purpose
   * @param _winner is the epoch's entry of results: 0 for team 0 win, 1 for team 1 win,
   * 2 for tie or no contest
   * @return first arg is success bool, second the new epoch,
   * third the oracle fee in szabos (avax/1e12).
   */
  function settle(
    uint8[32] memory _winner
  ) external onlyAdmin returns (uint32, uint256) {
    uint64 betReturnPot;
    uint64 winningsPot;
    uint32 epochMatch;
    uint32 winningTeam;
    for (uint32 i = 0; i < 32; i++) {
      winningTeam = _winner[i];
      uint64[4] memory _betData = decodeNumber(i);
      epochMatch = i * 10 + params[0] * 1000;
      if ((_betData[0] + _betData[1]) > 0) {
        if (winningTeam != 2) {
          betReturnPot += _betData[winningTeam];
          winningsPot += _betData[winningTeam + 2];
          outcomeMap[(epochMatch + winningTeam)] = 2;
        } else {
          betReturnPot += (_betData[0] + _betData[1]);
          outcomeMap[epochMatch] = 1;
          outcomeMap[1 + epochMatch] = 1;
        }
      }
    }
    uint256 oracleDiv = ORACLE_5PERC * uint256(winningsPot);
    margin[0] = margin[0] + margin[2] - betReturnPot - winningsPot;
    margin[1] = 0;
    margin[2] = 0;
    params[0]++;
    delete betData;
    params[3] = FUTURE_START;
    payable(oracleAdmin).transfer(oracleDiv);
    return (params[0], oracleDiv);
  }

  /** @dev for distributing 60% of tokens to LPs. Once tokens are depleted 
 this is irrelevant. Tokens go to LP's EOA
   */
  function tokenReward() external {
    require(token.balanceOf(address(this)) > 0, "no token rewards left");
    uint256 lpShares = uint256(lpStruct[msg.sender].shares);
    require(lpShares > 0, "only for liq providers");
    require(params[0] > 5, "starts in epoch 6!");
    require(lpStruct[msg.sender].claimEpoch < params[0], "one claim per epoch");
    lpStruct[msg.sender].claimEpoch = params[0];
    uint256 _amt = ((lpShares * EPOCH_AMOUNT) / uint256(margin[3]));
    token.transfer(msg.sender, _amt);
    emit Funding(msg.sender, params[0], _amt, 5);
  }

  /** @dev limits the amount of LP capital that can be applied to a single match.
   * @param _concFactor sets the parameter that defines how much diversification is enforced.
   * eg, if 10, then the max position allowed by bettors is LPcapital/_concFactor
   */
  function adjustConcentrationFactor(uint32 _concFactor) external onlyAdmin {
    params[1] = _concFactor;
  }

  /** @dev this allows oracle to prevent new bets on contests that have bad odds
   * @param _badmatch0 is the first paused matches
   * @param _badmatch1 is the second paused matches
   */
  function pauseMatch(uint8 _badmatch0, uint8 _badmatch1) external onlyAdmin {
    paused[0] = _badmatch0;
    paused[1] = _badmatch1;
  }

  function showBetData() external view returns (uint256[32] memory _betData) {
    _betData = betData;
  }

  function showOdds() external view returns (uint16[32] memory _odds) {
    _odds = odds;
  }

  function showStartTime()
    external
    view
    returns (uint32[32] memory _startTime)
  {
    _startTime = startTime;
  }

  function showUserBetData(
    address userAddress
  ) external view returns (bytes32[16] memory _betDataUser) {
    uint256 top = uint256(userStruct[userAddress].counter);
    for (uint256 i = 0; i < top; i++) {
      _betDataUser[i] = userStruct[userAddress].trades[i];
    }
  }

  /**  @dev this makes it easier for the front-end to present the status of past bets
   * @return bool is true if the bet generated a win or tie and thus will move money back to the user's balance
   */
  function checkRedeem(bytes32 _subkID) external view returns (bool) {
    uint32 epochMatchWinner = betContracts[_subkID].epoch *
      1000 +
      betContracts[_subkID].matchNum *
      10 +
      betContracts[_subkID].pick;
    bool redeemable = (outcomeMap[epochMatchWinner] > 0);
    return redeemable;
  }

  // @dev unpacks uint256 to reveal match's odds and bet amounts
  function decodeNumber(
    uint256 _matchNumber
  ) internal view returns (uint64[4] memory _vec1) {
    uint256 _encoded = betData[_matchNumber];
    _vec1[0] = uint64(_encoded >> 192);
    _vec1[1] = uint64(_encoded >> 128);
    _vec1[2] = uint64(_encoded >> 64);
    _vec1[3] = uint64(_encoded);
  }

  // @dev takes the maximum of two data points or zero
  function maxZero(int64 _a, int64 _b) internal pure returns (int64) {
    int64 _c = (_a >= _b) ? _a : _b;
    if (_c <= 0) _c = 0;
    return _c;
  }
}
