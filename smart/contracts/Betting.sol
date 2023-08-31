pragma solidity ^0.8.0;

/**
SPDX-License-Identifier: WTFPL
@author Eric Falkenstein
my dog is very naughty
*/

import "./Token.sol";
import "./ConstantsBetting.sol";

contract Betting {
  // ability to pause 2 matches if odds are way off
  uint8[2] public paused;
  // decimal odds for favorite, decimal odds minus one times 1000
  uint16[32] public odds;
  //0 betEpoch, 1 concentration Limit, 2 nonce, 3 first Start Time
  uint32[4] public params;
  // UTC GMT
  uint32[32] public startTime;
  // 0 total LPcapital, 1 LPcapitalLocked, 2 bettorLocked, 3 totalShares
  uint64[4] public margin;
  /// 0-betLong[favorite], 1-betLong[away], 2-betPayout[favorite], 3-betPayout[underdog]
  uint256[32] public betData;
  address payable public oracleAdmin;
  /// for transacting with the external stablecoin
  Token public token;
  // individual bet contracts
  mapping(bytes32 => Subcontract) public betContracts;
  /// this maps the set {epoch, match, team} to its event outcome,
  ///where 0 is a loss, 1 is a tie or postponement, 2 a win
  mapping(uint32 => uint8) public outcomeMap;
  /// This keeps track of an LP's ownership in the LP eher capital,
  mapping(address => LPStruct) public lpStruct;
  /// this struct holds a user's ETH balance
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
    uint64 moveAmount,
    uint32 epoch,
    uint32 action
  );

  constructor(address payable _tokenAddress) {
    // concentration limit
    params[1] = 5;
    // initial bet epoch one
    params[0] = 1;
    // first contest
    params[3] = 2e9;
    token = Token(_tokenAddress);
  }

  /// @dev restricts data submissions to the Oracle contract

  modifier onlyAdmin() {
    require(oracleAdmin == msg.sender);
    _;
  }

  /// @dev initial deployment sets administrator as the Oracle contract
  /// @param  _oracleAddress is the only account that can process several transactions in this contract
  function setOracleAddress(address payable _oracleAddress) external {
    require(oracleAdmin == address(0x0), "Only once");
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
    require(userStruct[msg.sender].counter < 16, "redeem bets to reset acct");
    require(
      _betAmt <= int64(uint64(userStruct[msg.sender].userBalance)),
      "over capital balance"
    );
    require(_betAmt >= MIN_BET, "bets must be ge 1 avax");
    require(
      paused[0] != _matchNumber && paused[1] != _matchNumber,
      "match is paused"
    );
    //require(startTime[_matchNumber] > block.timestamp, "game started");
    uint64[4] memory _betData = decodeNumber(_matchNumber);
    int64 betPayoff = int64(uint64(odds[_matchNumber]));
    if (_team0or1 == 0) {
      betPayoff = (_betAmt * betPayoff) / 1000;
    } else {
      betPayoff =
        (_betAmt * (1e6 / (betPayoff + ODDS_FACTOR) - ODDS_FACTOR)) /
        1000;
    }
    int64 netPosTeamBet = int64(_betData[2 + _team0or1]) -
      int64(_betData[1 - _team0or1]);
    require(
      int64(betPayoff + netPosTeamBet) <= int64(margin[0] / uint64(params[1])),
      "betsize over global book limit"
    );
    int64 netPosTeamOpp = int64(_betData[3 - _team0or1]) -
      int64(_betData[_team0or1]);
    int64 marginChange = maxZero(
      betPayoff + netPosTeamBet,
      -_betAmt + netPosTeamOpp
    ) - maxZero(netPosTeamBet, netPosTeamOpp);
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

  /**  @dev assigns results to matches, enabling withdrawal, removes capital for this purpose
   * @param _winner is the epoch's entry of results: 0 for team 0 win, 1 for team 1 win, 2 for tie or no contest
   * @return ethDividend, the second argument, is sent to the oracle contract
   * the oracle contract needs this number to adjust its global oracle fee variable
   * used to allocate oracle revenue among token holders
   */
  function settle(
    uint8[32] memory _winner
  ) external onlyAdmin returns (bool, uint32, uint256) {
    uint64 redemptionPot;
    uint64 payoffPot;
    uint32 epochMatch;
    uint32 winningTeam;
    for (uint32 i = 0; i < 32; i++) {
      winningTeam = _winner[i];
      uint64[4] memory _betData = decodeNumber(i);
      epochMatch = i * 10 + params[0] * 1000;
      if ((_betData[0] + _betData[1]) > 0) {
        if (winningTeam != 2) {
          redemptionPot += _betData[winningTeam];
          payoffPot += _betData[winningTeam + 2];
          outcomeMap[(epochMatch + winningTeam)] = 2;
        } else {
          redemptionPot += (_betData[0] + _betData[1]);
          outcomeMap[epochMatch] = 1;
          outcomeMap[1 + epochMatch] = 1;
        }
      }
    }
    uint256 oracleDiv = ORACLE_5PERC * uint256(payoffPot);
    margin[0] = margin[0] + margin[2] - redemptionPot - payoffPot;
    margin[1] = 0;
    margin[2] = 0;
    params[0]++;
    delete betData;
    params[3] = FUTURE_START;
    payable(oracleAdmin).transfer(oracleDiv);
    return (true, params[0], oracleDiv);
  }

  /// @dev bettor funds account for bets
  function fundBettor() external payable {
    // removes insignificant decimals for internal accounting w/ uint64
    uint64 amt = uint64(msg.value / UNITS_TRANS14);
    require(amt >= MIN_BET_DEPOSIT, "need at least one avax");
    userStruct[msg.sender].userBalance += amt;
    emit Funding(msg.sender, amt, params[0], 0);
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
    // LP can only withdraw after this epoch
    lpStruct[msg.sender].outEpoch = params[0] + MIN_LP_DURATION;
    // monitors total LP shares
    margin[3] += _shares;
    // individual shares is the measure of this account's LP position
    lpStruct[msg.sender].shares += _shares;
    emit Funding(msg.sender, uint32(netinvestment), params[0], 1);
  }

  /** @dev withdrawal in avax, where 10000 = 1 avaxs
   * @param _amt is the bettor amount withdrawn.
   */
  function withdrawBettor(uint64 _amt) external {
    // budget constraint check
    require(_amt <= userStruct[msg.sender].userBalance);
    userStruct[msg.sender].userBalance -= _amt;
    uint256 amt256 = uint256(_amt) * UNITS_TRANS14;
    payable(msg.sender).transfer(amt256);
    emit Funding(msg.sender, uint64(amt256), params[0], 3);
  }

  /** @dev processes withdrawal in 0.1 finney by LPs
   * @param _sharesToSell is the LP's ownership stake withdrawn.
   */
  function withdrawBook(uint64 _sharesToSell) external {
    require(block.timestamp < params[3], "only prior to first event");
    require(lpStruct[msg.sender].shares >= _sharesToSell, "NSF");
    require(params[0] > lpStruct[msg.sender].outEpoch, "too soon");
    uint64 ethWithdraw = (_sharesToSell * margin[0]) / margin[3];
    // LP cannot withdraw if bettors have locked up their capital
    require(
      ethWithdraw <= (margin[0] - margin[1]),
      "insufficient free capital"
    );
    // total shares decremented
    margin[3] -= _sharesToSell;
    // individual shares decremented
    lpStruct[msg.sender].shares -= _sharesToSell;
    // LP capital decremented
    margin[0] -= ethWithdraw;
    uint256 ethWithdraw256 = uint256(ethWithdraw) * UNITS_TRANS14;
    payable(msg.sender).transfer(ethWithdraw256);
    emit Funding(msg.sender, uint64(ethWithdraw), params[0], 4);
  }

  /** @dev redeems winning bet and allocates winnings to user's balance for later withdrawal or future betting
   */

  function redeem() external {
    uint256 numberBets = userStruct[msg.sender].counter;
    require(numberBets > 0, "no bets");
    uint64 payout;
    for (uint256 i = 0; i < numberBets; i++) {
      bytes32 _subkId = userStruct[msg.sender].trades[i];
      if (betContracts[_subkId].epoch == params[0]) revert("bets active");
      // creates epoch~matchnumber~pick number via concatenation
      uint32 epochMatch = betContracts[_subkId].epoch *
        1000 +
        betContracts[_subkId].matchNum *
        10 +
        betContracts[_subkId].pick;
      if (outcomeMap[epochMatch] != 0) {
        // to get bet amount back, user has either won or tied
        payout += betContracts[_subkId].betAmount;
        // a winning bet == 2,  only winners get payoff
        if (outcomeMap[epochMatch] == 2) {
          payout += (betContracts[_subkId].payoff * 95) / 100;
        }
      }
    }
    userStruct[msg.sender].counter = 0;
    // credit principle + payout to redeemer's balance
    userStruct[msg.sender].userBalance += payout;
    emit Funding(msg.sender, payout, params[0], 2);
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
    params[3] = ts - ((ts - 1687564800) % 604800) + 604800;
    // sets start of games at Sat 12AM GMT time
    // resets the paused matches (99 will never be relevant)
    paused[0] = 99;
    paused[1] = 99;
    return true;
  }

  /** @dev processes updates to epoch's odds
   * @param _updateOdds updates the epoch's odds. Data are packed into uint64.
   */
  function transmitUpdate(uint16[32] calldata _updateOdds) external onlyAdmin {
    odds = _updateOdds;
    paused[0] = 99;
    paused[1] = 99;
  }

  function tokenReward() external {
    require(token.balanceOf(address(this)) > 0, "no token rewards left");
    uint256 lpShares = lpStruct[msg.sender].shares;
    require(lpShares > 0, "only for liq providers");
    require(lpStruct[msg.sender].claimEpoch < params[0], "one claim per epoch");
    lpStruct[msg.sender].claimEpoch = params[0];
    uint64 _amt = uint64((lpShares * EPOCH_AMOUNT) / uint256(margin[3]));
    token.transfer(msg.sender, _amt);
    emit Funding(msg.sender, _amt, params[0], 5);
  }

  /** @dev It limits the amount of LP capital that can be applied to a single match.
   * @param _maxPos sets the parameter that defines how much diversification is enforced.
   */
  function adjustParams(uint32 _maxPos) external onlyAdmin {
    params[1] = _maxPos;
  }

  /** @dev this allows   token holders to freeze contests that have bad odds
   * it takes a day to input new odds, so if they are really off this can limit the damage
   * @param _badmatch0 is the first of two potential paused matches
   * @param _badmatch1 is the first of two potential paused matches
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

  function showUserBetData()
    external
    view
    returns (bytes32[16] memory _betDataUser)
  {
    uint256 top = uint256(userStruct[msg.sender].counter);
    for (uint256 i = 0; i < top; i++) {
      _betDataUser[i] = userStruct[msg.sender].trades[i];
    }
  }

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
  ) internal view returns (uint64[4] memory vec1) {
    uint256 _encoded = betData[_matchNumber];
    vec1[0] = uint64(_encoded >> 192);
    vec1[1] = uint64(_encoded >> 128);
    vec1[2] = uint64(_encoded >> 64);
    vec1[3] = uint64(_encoded);
  }

  // @dev takes the maximum of two data points or zero
  function maxZero(int64 a, int64 b) internal pure returns (int64) {
    int64 c = a >= b ? a : b;
    if (c <= 0) c = 0;
    return c;
  }
}
