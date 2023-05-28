pragma solidity ^0.8.0;

/**
SPDX-License-Identifier: MIT
@author Eric Falkenstein
*/

import "./Token.sol";

contract Betting {
  /** totalShares is used to monitor an LP's share of LP eth in the contract.
  * 0 bookie, 1 bookieLocked, 2 bettorLocked,
  3 betEpoch, 4 totalShares, 5 concentrationLimit, 6 nonce, 7 firstStart
  */
  uint32[8] public margin;
  // for emergency shutdown
  uint8[2] public paused;
  /// betLong[favorite], betLong[away], betPayout[favorite], betPayout[underdog], starttime, odds
  uint256[32] public betData;
  address payable public oracleAdmin;
  /// this struct contains the parameters of a bet
  Token public token;
  uint256 public constant UNITS_TRANS14 = 1e14;
  uint32 public constant FUTURE_START = 2e9;
  uint256 public constant ORACLE_5PERC = 5e12;
  uint32 public constant MIN_BET = 10; // 1 finney aka 0.001 ETH
  uint32 public constant MIN_LP_DURATION = 0; // SET TO 2 IN PROD
  mapping(bytes32 => Subcontract) public betContracts;
  mapping(bytes32 => Subcontract) public offerContracts;
  /// this maps the set {epoch, match, team} to its event outcome, 
  ///where 0 is a loss, 1 is a tie or postponement, 2 a win
  /// The outcome defaults to 0, so that these need not be updated for a loss
  mapping(uint32 => uint8) public outcomeMap;
  /// This keeps track of an LP's ownership in the LP ether capital,
  /// and also when it can first withdraw capital (two settlement periods)
  mapping(address => LPStruct) public lpStruct;
  /// this struct holds a user's ETH balance
  mapping(address => uint32) public userBalance;
  /// Schedule is a string where Sport:FavoriteTeam:UnderdogTeam

  struct Subcontract {
    uint8 epoch;
    uint8 matchNum;
    uint8 pick;
    uint32 betAmount;
    uint32 payoff;
    address bettor;
  }

  struct LPStruct {
    uint32 shares;
    uint32 outEpoch;
  }

  event BetRecord(
    address indexed bettor,
    uint8 indexed epoch,
    uint8 matchNum,
    uint8 pick,
    uint32 betAmount,
    uint32 payoff,
    bytes32 contractHash
  );

  event OfferRecord(
    address indexed bettor,
    uint8 indexed epoch,
    uint8 matchNum,
    uint8 pick,
    uint32 betAmount,
    uint32 payoff,
    bytes32 contractHash
  );

  event Funding(
    address bettor,
    uint256 moveAmount,
    uint32 epoch,
    uint32 action
  );

  constructor(address payable _tokenAddress) {
    // concentration limit
    margin[5] = 5;
    // initial bet epoch one
    margin[3] = 1;
    // first contest
    margin[7] = 2e9;
    token = Token(_tokenAddress);
  }

  /// @dev restricts data submissions to the Oracle contract
  modifier onlyAdmin() {
    require(oracleAdmin == msg.sender);
    _;
  }

  /// @dev initial deployment sets administrator as the Oracle contract
  function setOracleAddress(address payable _oracleAddress) external {
    require(oracleAdmin == address(0x0), "Only once");
    oracleAdmin = _oracleAddress;
  }

  receive() external payable {}

  /** @dev processes simple bet
   * @param _matchNumber is 0 to 31, representing the match
   * @param _team0or1 is the initial favorite (0) and underdog (1)
   * @param _betAmt is the amount bet in 10s of finney, 0.0001 ether
   */
  function bet(
    uint8 _matchNumber,
    uint8 _team0or1,
    uint32 _betAmt
  ) external {
    require(_betAmt <= userBalance[msg.sender] && _betAmt >= MIN_BET, "NSF ");
    require(_matchNumber != paused[0] && _matchNumber != paused[1]);
    // pulls odds, start time, betamounts on match
    uint32[7] memory betDatav = decodeNumber(betData[_matchNumber]);
    require(betDatav[4] > block.timestamp, "game started or not playing");
    // winnings to bettor if they win
    int32 betPayoff = (int32(_betAmt) * int32(betDatav[5 + _team0or1])) / 1000;
    // current net position of LP collective to this match/pick
    int32 netPosTeamBet = int32(betDatav[2 + _team0or1]) -
      int32(betDatav[1 - _team0or1]);
    // subsequent net position after bet must be less than LP totLiq/concentration factor
    require(
      int32(betPayoff + netPosTeamBet) < int32(margin[0] / margin[5]),
      "betsize over limit"
    );
    int32 netPosTeamOpp = int32(betDatav[3 - _team0or1]) -
      int32(betDatav[_team0or1]);
    // LP net required margin change from bet
    int32 marginChange = maxZero(
      int32(betPayoff) + netPosTeamBet,
      -int32(_betAmt) + netPosTeamOpp
    ) - maxZero(netPosTeamBet, netPosTeamOpp);
    require(
      marginChange < int32(margin[0] - margin[1]),
      "betsize over unpledged capital"
    );
    userBalance[msg.sender] -= _betAmt;
    bytes32 subkID = keccak256(abi.encodePacked(margin[6], block.timestamp));
    Subcontract memory order;
    order.bettor = msg.sender;
    order.betAmount = _betAmt;
    order.payoff = uint32(betPayoff);
    order.pick = _team0or1;
    order.matchNum = _matchNumber;
    order.epoch = uint8(margin[3]);
    betContracts[subkID] = order;
    margin[2] += _betAmt;
    margin[1] = uint32(addSafe(margin[1], marginChange));
    betDatav[_team0or1] += _betAmt;
    betDatav[2 + _team0or1] += uint32(betPayoff);
    uint256 encoded;
    encoded |= uint256(betDatav[0]) << 224;
    encoded |= uint256(betDatav[1]) << 192;
    encoded |= uint256(betDatav[2]) << 160;
    encoded |= uint256(betDatav[3]) << 128;
    encoded |= uint256(betDatav[4]) << 64;
    encoded |= uint256(betDatav[5]) << 32;
    encoded |= uint256(betDatav[6]);
    betData[_matchNumber] = encoded;
    margin[6]++;
    emit BetRecord(
      msg.sender,
      uint8(margin[3]),
      _matchNumber,
      _team0or1,
      _betAmt,
      uint32(betPayoff),
      subkID
    );
  }

  /** @dev processes large bet where the size and odds are of the poster's choosing
   * @param _matchNum is 0 to 31, representing the match
   * @param _team0or1 is the initial favorite (0) and underdog (1) poster wants to win
   * @param _betAmount is the amount bet in 10s of finney, 0.0001 ether
   * @param _decOddsBB is the proposed odds on tthte poster's desired team, decimal odds for 1.909 are input as 1909
   */
  function postBigBet(
    uint8 _matchNum,
    uint8 _team0or1,
    uint32 _betAmount,
    uint32 _decOddsBB
  ) external {
    //require(_betAmount >= margin[0] / margin[5], "too small");
    require(_betAmount <= userBalance[msg.sender], "NSF");
    // data in raw decimal form, times 1000. Standard 1.91 odds would be 1910
    require(_decOddsBB > 1000 && _decOddsBB < 9000, "invalid odds");
    bytes32 subkID = keccak256(abi.encodePacked(margin[6], block.timestamp));
    Subcontract memory order;
    order.pick = _team0or1;
    order.matchNum = _matchNum;
    order.epoch = uint8(margin[3]);
    order.bettor = msg.sender;
    order.betAmount = _betAmount;
    order.payoff = ((_decOddsBB - 1000) * _betAmount) / 1000;
    offerContracts[subkID] = order;
    margin[6]++;
    emit OfferRecord(
      msg.sender,
      uint8(margin[3]),
      _matchNum,
      _team0or1,
      order.betAmount,
      order.payoff,
      subkID
    );
  }

  /* @dev takes outstanding offered bet
   * @param _subkid is the picked contract's HashID
   */
  function takeBigBet(bytes32 _subkid) external {
    Subcontract memory k = offerContracts[_subkid];
    uint32[7] memory betDatav = decodeNumber(betData[k.matchNum]);
    require(betDatav[4] > block.timestamp, "game started");
    require(k.epoch == margin[3], "expired bet");
    require(
      userBalance[k.bettor] >= k.betAmount &&
        userBalance[msg.sender] >= k.payoff,
      "NSF"
    );
    betDatav[k.pick] += k.betAmount;
    betDatav[2 + k.pick] += k.payoff;
    betDatav[1 - k.pick] += k.payoff;
    betDatav[3 - k.pick] += k.betAmount;
    userBalance[k.bettor] -= k.betAmount;
    betContracts[_subkid] = k;
    emit BetRecord(
      k.bettor,
      uint8(margin[3]),
      k.matchNum,
      k.pick,
      k.betAmount,
      k.payoff,
      _subkid
    );
    bytes32 subkID2 = keccak256(abi.encodePacked(margin[6], block.timestamp));
    k.bettor = msg.sender;
    (k.payoff, k.betAmount) = (k.betAmount, k.payoff);
    k.pick = 1 - k.pick;
    margin[2] += (k.payoff + k.betAmount);
    userBalance[msg.sender] -= k.betAmount;
    emit BetRecord(
      msg.sender,
      uint8(margin[3]),
      k.matchNum,
      k.pick,
      k.betAmount,
      k.payoff,
      subkID2
    );
    uint256 encoded;
    encoded |= uint256(betDatav[0]) << 224;
    encoded |= uint256(betDatav[1]) << 192;
    encoded |= uint256(betDatav[2]) << 160;
    encoded |= uint256(betDatav[3]) << 128;
    encoded |= uint256(betDatav[4]) << 64;
    encoded |= uint256(betDatav[5]) << 32;
    encoded |= uint256(betDatav[6]);
    betData[k.matchNum] = encoded;
    betContracts[subkID2] = k;
    margin[6]++;
    delete offerContracts[_subkid];
  }

  /* @dev cancels outstanding offered bet
   * @param _subkid is the bet's unique ID
   */
  function cancelBigBet(bytes32 _subkid) external {
    require(offerContracts[_subkid].bettor == msg.sender, "wrong account");
    delete betContracts[_subkid];
  }

  /* @dev assigns results to matches, enabling withdrawal, removes capital for this purpose
   * @param _winner is the epoch's entry of results: 1 for team 1 win, 0 for team 0 win, 2 for tie or no contest
   */
  function settle(uint8[32] memory _winner)
    external
    onlyAdmin
    returns (uint32, uint256)
  {
    uint32 redemptionPot;
    uint32 payoffPot;
    uint256 epochMatch;
    uint256 winningTeam;
    for (uint256 i = 0; i < 32; i++) {
      winningTeam = _winner[i];
      uint32[7] memory betDatav = decodeNumber(betData[i]);
      epochMatch = i * 10 + margin[3] * 1000;
      if ((betDatav[0] + betDatav[1]) > 0) {
        //if not a tie
        if (winningTeam != 2) {
          redemptionPot += betDatav[winningTeam];
          payoffPot += betDatav[winningTeam + 2];
          // winning bet assigned number 2
          outcomeMap[uint32(epochMatch + winningTeam)] = 2;
        } else {
          // tie or no contest assigned number 1
          redemptionPot += (betDatav[0] + betDatav[1]);
          outcomeMap[uint32(epochMatch)] = 1;
          outcomeMap[uint32(1 + epochMatch)] = 1;
        }
      }
    }
    margin[3]++;
    uint256 oracleDiv = ORACLE_5PERC * uint256(payoffPot);
    margin[0] = addSafe(
      margin[0] + margin[2],
      -int32(redemptionPot + payoffPot)
    );
    margin[1] = 0;
    margin[2] = 0;
    delete betData;
    margin[7] = FUTURE_START;
    (bool success, ) = oracleAdmin.call{ value: oracleDiv }("");
    require(success, "Call failed");
    return (margin[3], oracleDiv);
  }

  /// @dev bettor funds account for bets
  function fundBettor() external payable {
    uint32 amt = uint32(msg.value / UNITS_TRANS14);
    userBalance[msg.sender] += amt;
    emit Funding(msg.sender, msg.value, margin[3], 0);
  }

  /// @dev funds LP for supplying capital to take bets
  function fundBook() external payable {
    require(block.timestamp < uint32(margin[7]), "only prior to first event");
    uint32 netinvestment = uint32(msg.value / UNITS_TRANS14);
    uint32 _shares = 0;
    if (margin[0] > 0) {
      _shares = multiply(netinvestment, margin[4]) / margin[0];
    } else {
      _shares = netinvestment;
    }
    margin[0] = addSafe(margin[0], int32(netinvestment));
    // PRODUCTION CHANGE
    lpStruct[msg.sender].outEpoch = margin[3] + MIN_LP_DURATION;
    margin[4] += _shares;
    lpStruct[msg.sender].shares += _shares;
    emit Funding(msg.sender, msg.value, margin[3], 1);
  }

  /** @dev redeems winning bet and allocates winnings to user's balance for later withdrawal or future betting
   * @param _subkId is the bet's unique ID
   */
  function redeem(bytes32 _subkId) external {
    require(betContracts[_subkId].bettor == msg.sender, "wrong account");
    uint32 epochMatch = betContracts[_subkId].epoch *
      1000 +
      betContracts[_subkId].matchNum *
      10 +
      betContracts[_subkId].pick;
    require(outcomeMap[epochMatch] != 0, "need win or tie");
    uint32 payoff = betContracts[_subkId].betAmount;

    if (outcomeMap[epochMatch] == 2) {
      payoff += (betContracts[_subkId].payoff * 95) / 100;
    }
    delete betContracts[_subkId];
    userBalance[msg.sender] += payoff;
    emit Funding(msg.sender, payoff, margin[3], 2);
  }

  /** @dev withdrawal in 0.1 finney by bettors
   * @param _amt is the bettor amount withdrawn. 1 represents 0.1 finney, or 0.0001 eth
   */
  function withdrawBettor(uint32 _amt) external {
    require(_amt <= userBalance[msg.sender]);
    userBalance[msg.sender] -= _amt;
    uint256 amt256 = uint256(_amt) * UNITS_TRANS14;
    // payable(msg.sender).transfer(amt256);
    (bool success, ) = payable(msg.sender).call{ value: amt256 }("");
    require(success, "Call failed");
    emit Funding(msg.sender, amt256, margin[3], 3);
  }

  /** @dev processes withdrawal in 0.1 finney by LPs
   * @param _sharesToSell is the LP's ownership stake withdrawn.
   */
  function withdrawBook(uint32 _sharesToSell) external {
    require(block.timestamp < uint32(margin[7]), "only prior to first event");
    require(lpStruct[msg.sender].shares >= _sharesToSell, "NSF");
    //require(margin[3] > lpStruct[msg.sender].outEpoch, "too soon");
    uint32 ethWithdraw = multiply(_sharesToSell, margin[0]) / margin[4];
    require(
      ethWithdraw <= (margin[0] - margin[1]),
      "insufficient free capital"
    );
    margin[4] -= _sharesToSell;
    lpStruct[msg.sender].shares -= _sharesToSell;
    margin[0] -= ethWithdraw;
    uint256 ethWithdraw256 = uint256(ethWithdraw) * UNITS_TRANS14;
    //payable(msg.sender).transfer(ethWithdraw256);
    (bool success, ) = payable(msg.sender).call{ value: ethWithdraw256 }("");
    require(success, "Call failed");
    emit Funding(msg.sender, ethWithdraw256, margin[3], 4);
  }

  /** @dev processes initial odds and start times
   * @param _oddsAndStart is the epoch's set of odds and start times for matches. Data are packed into uint96.
   * the first event is stored into margin[7] as when LPs can no longe add or remove liquidity
   */
  function transmitInit(uint96[32] memory _oddsAndStart)
    external
    onlyAdmin
    returns (bool)
  {
    require(margin[2] == 0);
    betData = _oddsAndStart;
    margin[7] = uint32(_oddsAndStart[0] >> 64);
    paused[0] = 99;
    paused[1] = 99;
    return true;
  }

  /** @dev processes updates to epoch's odds
   * @param _updateBetData updates the epoch's odds. Data are packed into uint64.
   */
  function transmitUpdate(uint64[32] memory _updateBetData) external onlyAdmin {
    uint256 encoded;
    for (uint256 i = 0; i < 32; i++) {
      uint256 x = uint256(betData[i] >> 64);
      encoded |= uint256(x) << 64;
      encoded |= uint256(_updateBetData[i]);
      betData[i] = encoded;
      delete encoded;
      paused[0] = 99;
      paused[1] = 99;
    }
  }

  /** @dev It limits the amount of LP capital that can be applied to a single match.
   * @param _maxPos sets the parameter that defines how much diversification is enforced.
   */
  function adjustParams(uint32 _maxPos) external onlyAdmin {
    margin[5] = _maxPos;
  }

  /** @dev It limits the amount of LP capital that can be applied to a single match.
   * @param _bad1 is the first of two potential paused matches
   * @param _bad2 is the second of two potential paused matches
   * these are reset to 99 on updates sets the parameter that defines how much diversification is enforced.
   */
  function pauseMatch(uint8 _bad1, uint8 _bad2) external onlyAdmin {
    paused[0] = _bad1;
    paused[1] = _bad2;
  }

  
    function showBetData() external view returns (uint256[32] memory) {
        return betData;
    }

  // @dev unpacks uint256 to reveal match's odds and bet amounts
  function decodeNumber(uint256 _encoded)
    internal
    pure
    returns (uint32[7] memory vec1)
  {
    vec1[0] = uint32(_encoded >> 224);
    vec1[1] = uint32(_encoded >> 192);
    vec1[2] = uint32(_encoded >> 160);
    vec1[3] = uint32(_encoded >> 128);
    vec1[4] = uint32(_encoded >> 64);
    vec1[5] = uint32(_encoded >> 32);
    vec1[6] = uint32(_encoded);
  }

  // @dev takes the maximum of two data points or zero
  function maxZero(int32 a, int32 b) internal pure returns (int32) {
    int32 c = a >= b ? a : b;
    if (c <= 0) c = 0;
    return c;
  }

  function multiply(uint32 _a, uint32 _b) internal pure returns (uint32) {
    uint32 c = _a * _b;
    require(c / _a == _b, "mult overflow");
    return c;
  }

  function addSafe(uint32 _a, int32 _b) internal pure returns (uint32) {
    uint32 c;
    if (_b < 0) {
      c = _a - uint32(-_b);
      require(c < _a, "overflow");
    } else {
      c = _a + uint32(_b);
      require(c >= _a, "overflow");
    }
    return c;
  }
}
