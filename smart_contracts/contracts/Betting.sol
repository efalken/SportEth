pragma solidity ^0.8.0;

/**
SPDX-License-Identifier: MIT
@author Eric Falkenstein
*/

import "./Token.sol";

import "./ConstantsBetting.sol";

contract Betting {
  /** 0 bookie capital total, 1 bookie capital Locked, 2 bettorLocked,
  3 betEpoch, 4 totalShares, 5 concentration Limit, 6 nonce, 7 first Start Time
  */
  uint32[8] public margin;
  // for emergency shutdown
  uint8[2] public paused;
  /// betLong[favorite], betLong[away], betPayout[favorite], betPayout[underdog], starttime, odds
  uint256[32] public betData;
  // only oracle contract can execute several functions
  address payable public oracleAdmin;
  /// for transacting with the external stablecoin
  Token public token;
  // individual bet contracts
  mapping(bytes32 => Subcontract) public betContracts;
  // individual offered big bets
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
  mapping(address => bytes32) public lastTransaction;

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
  /// @param  _oracleAddress is the only account that can process several transactions in this contract
  function setOracleAddress(address payable _oracleAddress) external {
    require(oracleAdmin == address(0x0), "Only once");
    oracleAdmin = _oracleAddress;
  }

  function checkOffer(bytes32 _subkID) external view returns (bool) {
    bool takeable = (offerContracts[_subkID].betAmount > 0);
    return takeable;
  }

  receive() external payable {}

  /** @dev processes a basic bet
   * @param _matchNumber is 0 to 31, representing the match number as presented in the sequence of weekly matches
   * @param _team0or1 denotes the initial favorite (0) and underdog (1) for a given epoch and matchNumber
   * @param _betAmt is the amount bet in 10s of finney, 0.0001 ether
   */
  function bet(uint8 _matchNumber, uint8 _team0or1, uint32 _betAmt) external returns (bytes32) {
    // user needs sufficient capital to make bet
    require(_betAmt <= userBalance[msg.sender] && _betAmt >= MIN_BET, "NSF ");
    // pause[0] and [1] can be used to prevent betting when an odds number posted is very wrong
    // this provides an emergency method to limit the damage of bad odds
    require(_matchNumber != paused[0] && _matchNumber != paused[1]);
    // pulls odds, start time, betamounts on match
    uint32[7] memory betDatav = decodeNumber(betData[_matchNumber]);
    // cannot bet on a game once it has started
    require(betDatav[4] > block.timestamp, "game started or not playing");
    // winnings to bettor if they win
    int32 betPayoff = (int32(_betAmt) * int32(betDatav[5 + _team0or1])) / 1000;
    // current LP net position to this bet
    int32 netPosTeamBet = int32(betDatav[2 + _team0or1]) -
      int32(betDatav[1 - _team0or1]);
    // subsequent LP net exposure on this bet, after the bet, must be less than LP totLiq/concentration factor
    require(
      int32(betPayoff + netPosTeamBet) < int32(margin[0] / margin[5]),
      "betsize over limit"
    );
    // current net LP position to the opponent of this bet
    int32 netPosTeamOpp = int32(betDatav[3 - _team0or1]) -
      int32(betDatav[_team0or1]);
    // LP net required margin change from bet
    int32 marginChange = maxZero(
      int32(betPayoff) + netPosTeamBet,
      -int32(_betAmt) + netPosTeamOpp
    ) - maxZero(netPosTeamBet, netPosTeamOpp);
    // margin[0] is total bookie capital, and margin[1] is the total pledged capital locked up for this weekend's games
    // the difference is the pool available for collateralizing an additional bet
    require(
      marginChange < int32(margin[0] - margin[1]),
      "betsize over unpledged capital"
    );
    // if passed to here, subtract desired bet amount from user balance
    userBalance[msg.sender] -= _betAmt;
    bytes32 subkID = keccak256(abi.encodePacked(margin[6], block.timestamp));
    Subcontract memory order;
    order.bettor = msg.sender;
    order.betAmount = _betAmt;
    order.payoff = uint32(betPayoff);
    order.pick = _team0or1;
    order.matchNum = _matchNumber;
    order.epoch = uint8(margin[3]);
    // bet is assigned to a struct via a mapping of its unique match criteria and the bettor address
    betContracts[subkID] = order;
    // adds to LP collateral locked for this weekend
    margin[2] += _betAmt;
    margin[1] = uint32(int32(margin[1]) + marginChange);
    betDatav[_team0or1] += _betAmt;
    betDatav[2 + _team0or1] += uint32(betPayoff);
    // pack data on match into one 256-bit number via bit shifting
    uint256 encoded;
    encoded |= uint256(betDatav[0]) << 224;
    encoded |= uint256(betDatav[1]) << 192;
    encoded |= uint256(betDatav[2]) << 160;
    encoded |= uint256(betDatav[3]) << 128;
    encoded |= uint256(betDatav[4]) << 64;
    encoded |= uint256(betDatav[5]) << 32;
    encoded |= uint256(betDatav[6]);
    betData[_matchNumber] = encoded;
    // increment nonce used for unique bet hash IDs
    margin[6]++;
    lastTransaction[msg.sender] = subkID;
    emit BetRecord(
      msg.sender,
      uint8(margin[3]),
      _matchNumber,
      _team0or1,
      _betAmt,
      uint32(betPayoff),
      subkID
    );
    return subkID;
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
  ) external returns (bytes32) {
    // we only want large bets, not just custom bets
    require(_betAmount >= margin[0] / margin[5], "too small");
    // cannot bet more than one has
    require(_betAmount <= userBalance[msg.sender], "NSF");
    // data in raw decimal form, times 1000. Standard 1.91 odds would be 1910
    // this targets trolls who post extreme odds hoping a confused or lazy person accidentally takes their offered bet. It's annoyingly common
    require(_decOddsBB > 1000 && _decOddsBB < 9000, "invalid odds");
    bytes32 subkID = keccak256(abi.encodePacked(margin[6], block.timestamp));
    Subcontract memory order;
    order.pick = _team0or1;
    order.matchNum = _matchNum;
    order.epoch = uint8(margin[3]);
    order.bettor = msg.sender;
    order.betAmount = _betAmount;
    // payoff determines the money needed to take the other side of this bet
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
    return subkID;
  }

  /* @dev takes outstanding offered bet
   * @param _subkid is the bet offer's unique HashID
   */
  function takeBigBet(bytes32 _subkid) external returns (bytes32) {
    Subcontract memory k = offerContracts[_subkid];
    uint32[7] memory betDatav = decodeNumber(betData[k.matchNum]);
    require(betDatav[4] > block.timestamp, "game started");
    require(k.epoch == margin[3], "expired bet");
    require(
      userBalance[k.bettor] >= k.betAmount &&
        userBalance[msg.sender] >= k.payoff,
      "NSF"
    );
    // bet amount for big bet proposer
    betDatav[k.pick] += k.betAmount;
    // bet payoff for big bet proposer
    betDatav[2 + k.pick] += k.payoff;
    // bet amount for big bet taker
    betDatav[1 - k.pick] += k.payoff;
    // bet payoff for big bet taker
    betDatav[3 - k.pick] += k.betAmount;
    // subtracts proposer bet amount from proposer's balance
    userBalance[k.bettor] -= k.betAmount;
    // puts proposer's big bet info into struct that can be accessed via hash mapping
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
    // creates hash of bet for taker
    bytes32 subkID2 = keccak256(abi.encodePacked(margin[6], block.timestamp));
    k.bettor = msg.sender;
    // reverses payout and betamount for taker
    (k.payoff, k.betAmount) = (k.betAmount, k.payoff);
    // if proposal is 1, taker gets 0, if proposal 0 taker gets 1
    k.pick = 1 - k.pick;
    userBalance[msg.sender] -= k.betAmount;
    margin[2] += (k.payoff + k.betAmount);
    emit OfferRecord(
      msg.sender,
      uint8(margin[3]),
      k.matchNum,
      k.pick,
      k.betAmount,
      k.payoff,
      _subkid
    );
    emit BetRecord(
      msg.sender,
      uint8(margin[3]),
      k.matchNum,
      k.pick,
      k.betAmount,
      k.payoff,
      subkID2
    );
    // net betting data for this match are saved
    uint256 encoded;
    encoded |= uint256(betDatav[0]) << 224;
    encoded |= uint256(betDatav[1]) << 192;
    encoded |= uint256(betDatav[2]) << 160;
    encoded |= uint256(betDatav[3]) << 128;
    encoded |= uint256(betDatav[4]) << 64;
    encoded |= uint256(betDatav[5]) << 32;
    encoded |= uint256(betDatav[6]);
    betData[k.matchNum] = encoded;
    // adds bet of taker to betContract struct
    betContracts[subkID2] = k;
    margin[6]++;
    delete offerContracts[_subkid];
    return subkID2;
  }

  /* @dev cancels outstanding offered bet
   * @param _subkid is the bet's unique ID
   * unnecessary for expired bet offers, which cannot be taken and do not affect user balances
   */
  function cancelBigBet(bytes32 _subkid) external {
    require(offerContracts[_subkid].bettor == msg.sender, "wrong account");
    delete offerContracts[_subkid];
  }

  /* @dev assigns results to matches, enabling withdrawal, removes capital for this purpose
   * @param _winner is the epoch's entry of results: 0 for team 0 win, 1 for team 1 win, 2 for tie or no contest
   * @return epoch is the first argument. The data epoch, match, pick create a tuple that uniquely identifies bets
   * @return ethDividend, the second argument, is sent to the oracle contract
   * the oracle contract needs this number to adjust its global oracle fee variable
   * used to allocate oracle revenue among token holders
   */
  function settle(
    uint8[32] memory _winner
  ) external onlyAdmin returns (uint32, uint256) {
    uint32 redemptionPot;
    uint32 payoffPot;
    uint256 epochMatch;
    uint256 winningTeam;
    for (uint256 i = 0; i < 32; i++) {
      winningTeam = _winner[i];
      // pulls data for each match that week
      uint32[7] memory betDatav = decodeNumber(betData[i]);
      epochMatch = i * 10 + margin[3] * 1000;
      // if no one bet on the match these numbers will both be zero, and it need not
      // be processed because it will not change the state
      if ((betDatav[0] + betDatav[1]) > 0) {
        //if not a tie
        if (winningTeam != 2) {
          redemptionPot += betDatav[winningTeam];
          payoffPot += betDatav[winningTeam + 2];
          // winning bet assigned number 2
          // useful because bettors redeem both wins and ties
          outcomeMap[uint32(epochMatch + winningTeam)] = 2;
        } else {
          // tie or no contest assigned number 1
          redemptionPot += (betDatav[0] + betDatav[1]);
          outcomeMap[uint32(epochMatch)] = 1;
          outcomeMap[uint32(1 + epochMatch)] = 1;
        }
      }
    }
    // sending avax to oracle adjusts from 5 to 18 decimals, and applies the 5% multiplication factor
    // 5e-2 is the factor to generate 5% of a number
    uint256 oracleDiv = ORACLE_5PERC * uint256(payoffPot);
    // first throws bookie and bettor money into a pot, then subtracts the money due to
    // bettors via payoff (payoffPot) and principal (redemptionPot)
    // this is the new net bookie balance
    margin[0] = margin[0] + margin[2] - redemptionPot - payoffPot;
    // bookie locked amount for the next week starts at zero
    margin[1] = 0;
    // bet amount for the next week starts at zero
    margin[2] = 0;
    // advances epoch
    margin[3]++;
    delete betData;
    // this sets the future start time in the future
    // bookies can only add or remove from their accounts when games have not started
    // this way bookies can add/withdraw when games are not active,
    // but the new schedule has not been posted
    margin[7] = FUTURE_START;
    // sends the oracle contract its weekly fee
    (bool success, ) = oracleAdmin.call{value: oracleDiv}("");
    require(success, "Call failed");
    return (margin[3], oracleDiv);
  }

  /// @dev bettor funds account for bets
  function fundBettor() external payable {
    // removes unneeded decimals for internal accounting
    uint32 amt = uint32(msg.value / UNITS_TRANS14);
    userBalance[msg.sender] += amt;
    emit Funding(msg.sender, msg.value, margin[3], 0);
  }

  /// @dev funds LP for supplying capital to take bets
  function fundBook() external payable {
    require(block.timestamp < uint32(margin[7]), "only prior to first event");
    uint256 netinvestment = (msg.value / 1e14);
    uint32 _shares = 0;
    if (margin[0] > 0) {
      _shares = uint32(
        (netinvestment * uint256(margin[4])) / uint256(margin[0])
      );
    } else {
      _shares = uint32(netinvestment);
    }
    margin[0] = margin[0] + uint32(netinvestment);
    // LP can only withdraw after this epoch
    lpStruct[msg.sender].outEpoch = margin[3] + MIN_LP_DURATION;
    // monitors total LP shares
    margin[4] += _shares;
    // individual shares is the only measure of this account's LP position
    lpStruct[msg.sender].shares += _shares;
    emit Funding(msg.sender, msg.value, margin[3], 1);
  }

  /** @dev redeems winning bet and allocates winnings to user's balance for later withdrawal or future betting
   * @param _subkId is the bet's unique ID
   */
  function redeem(bytes32 _subkId) external {
    require(betContracts[_subkId].bettor == msg.sender, "wrong account");
    // creates epoch~matchnumber~pick number via concatenation
    uint32 epochMatch = betContracts[_subkId].epoch *
      1000 +
      betContracts[_subkId].matchNum *
      10 +
      betContracts[_subkId].pick;
    require(outcomeMap[epochMatch] != 0, "need win or tie");
    // to get this far, user has either won or tied, and thus gets back initial
    // bet amount
    uint32 payoff = betContracts[_subkId].betAmount;
    // a winner gets the payoff, which is adjusted by 0.95 to pay oracle
    if (outcomeMap[epochMatch] == 2) {
      payoff += (betContracts[_subkId].payoff * 95) / 100;
    }
    delete betContracts[_subkId];
    // credit principle + payoff to redeemer's balance
    userBalance[msg.sender] += payoff;
    emit Funding(msg.sender, payoff, margin[3], 2);
  }

  /** @dev withdrawal in 0.1 finney by bettors
   * @param _amt is the bettor amount withdrawn. 1 represents 0.1 finney, or 0.0001 eth
   */
  function withdrawBettor(uint32 _amt) external {
    // basic budget constraint: check
    require(_amt <= userBalance[msg.sender]);
    userBalance[msg.sender] -= _amt;
    uint256 amt256 = uint256(_amt) * UNITS_TRANS14;
    // payable(msg.sender).transfer(amt256);
    (bool success, ) = payable(msg.sender).call{value: amt256}("");
    require(success, "Call failed");
    emit Funding(msg.sender, amt256, margin[3], 3);
  }

  /** @dev processes withdrawal in 0.1 finney by LPs
   * @param _sharesToSell is the LP's ownership stake withdrawn.
   */
  function withdrawBook(uint32 _sharesToSell) external {
    require(block.timestamp < uint32(margin[7]), "only prior to first event");
    require(lpStruct[msg.sender].shares >= _sharesToSell, "NSF");
    // process check
    require(margin[3] > lpStruct[msg.sender].outEpoch, "too soon");
    uint32 ethWithdraw = (_sharesToSell * margin[0]) / margin[4];
    // LP cannot withdraw if bettors have locked up their capital
    require(
      ethWithdraw <= (margin[0] - margin[1]),
      "insufficient free capital"
    );
    // total shares decremented
    margin[4] -= _sharesToSell;
    // individual shares decremented
    lpStruct[msg.sender].shares -= _sharesToSell;
    // LP capital decremented
    margin[0] -= ethWithdraw;
    uint256 ethWithdraw256 = uint256(ethWithdraw) * UNITS_TRANS14;
    //payable(msg.sender).transfer(ethWithdraw256);
    (bool success, ) = payable(msg.sender).call{value: ethWithdraw256}("");
    require(success, "Call failed");
    emit Funding(msg.sender, ethWithdraw256, margin[3], 4);
  }

  /** @dev processes initial odds and start times
   * @param _oddsAndStart is the epoch's set of odds and start times for matches. Data are packed into uint96.
   * the first event's start time is stored in margin[7]
   * it sets the time after which LPs can no longer add or remove liquidity
   */
  function transmitInit(
    uint96[32] memory _oddsAndStart
  ) external onlyAdmin returns (bool) {
    require(margin[2] == 0);
    betData = _oddsAndStart;
    uint32 x = uint32(_oddsAndStart[0] >> 64);
    margin[7] = x - ((x - 1687543200) % 604800);
    //margin[7] = uint32(_oddsAndStart[0] >> 64);
    // resets the paused matches (99 will never be possible)
    paused[0] = 99;
    paused[1] = 99;
    return true;
  }

  function showBetData() external view returns (uint256[32] memory _betData) {
    _betData = betData;
  }

  /** @dev processes updates to epoch's odds
   * @param _updateBetData updates the epoch's odds. Data are packed into uint64.
   */
  function transmitUpdate(uint64[32] memory _updateBetData) external onlyAdmin {
    uint256 encoded;
    for (uint256 i = 0; i < 32; i++) {
      uint256 x = uint256(betData[i] >> 64);
      // packs new odds data into last 64 bits of this 256 bit number
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
  function adjustParams(uint32 _maxPos) external {
    margin[5] = _maxPos;
  }

  /** @dev this allows token holders to freeze contests that have bad odds
   * it takes a day to input new odds, so if they are really off this can limit the damage
   * @param _bad1 is the first of two potential paused matches
   * @param _bad2 is the second of two potential paused matches
   * these are reset to 99 on updates sets the parameter that defines how much diversification is enforced.
   */
  function pauseMatch(uint8 _bad1, uint8 _bad2) external onlyAdmin {
    paused[0] = _bad1;
    paused[1] = _bad2;
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
    uint256 _encoded
  ) internal pure returns (uint32[7] memory vec1) {
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
}
