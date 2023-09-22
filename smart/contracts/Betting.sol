/**
SPDX-License-Identifier: MIT License
@author Eric G Falkenstein
*/
pragma solidity 0.8.19;

import "./Token.sol";
import "./ConstantsBetting.sol";

contract Betting {
  // 0 post-settle/pre-init, 1 post-initial slate/pre-odds
  // 2 post-odds/pre-settle
  uint32 public bettingStatus;
  // increments by one each settlement
  uint32 public bettingEpoch;
  // increments each bet
  uint64 public nonce;
  // adjustible factor for controlling concentration risk
  uint64 public concFactor;
  /* decimal odds for favorite, formatted as decimal odds minus one times 1000 */
  uint16[32] public odds;
  // UTC GMT aka Zulu time. In ISO 8601 it is distinguished by the Z suffix
  uint32[32] public startTime;
  // 0 total LPcapital, 1 LPcapitalLocked, 2 bettorLocked
  uint64[3] public margin;
  // LpShares used to calculate LP revenue
  uint64 public liqProvShares;
  /* 0-betLong[favorite], 1-betLong[away], 2-betPayout[favorite], 3-betPayout[underdog]
  These data are bitpacked for efficiency */
  uint256[32] public betData;
  // the oracle contract as exclusive access to several functions
  address payable public oracleAdmin;
  // for paying LP token Rewards
  Token public token;
  // individual bet contracts
  mapping(bytes32 => Subcontract) public betContracts;
  /* this maps the set {epoch, match, team} to its event outcome,
  via betTarget=epoch * 1000 + match * 10 + teamWinner. 
  For example, epoch 21, match 15, and team 0 wins, would be 21150 */
  mapping(uint32 => uint8) public outcomeMap;
  // This keeps track of an LP's data
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
    uint32 lpEpoch;
  }

  event BetRecord(
    address indexed bettor,
    uint32 indexed epoch,
    uint32 matchNum,
    uint32 pick,
    int64 betAmount,
    int64 payoff,
    bytes32 contractHash
  );

  event Funding(
    address indexed bettor,
    uint32 epoch,
    uint64 avax,
    uint32 action
  );

  event Redemption(
    address indexed bettor,
    uint32 epoch,
    uint64 payoff,
    uint32 betsRedeemed
  );

  event Rewards(address indexed bettor, uint32 epoch, uint256 tokens);

  constructor(address payable _tokenAddress) {
    concFactor = 5;
    bettingEpoch = 1;
    token = Token(_tokenAddress);
  }

  // @dev restricts data submissions to the Oracle contract

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
    int64 betPayoff = int64(uint64(odds[_matchNumber]));
    require(betPayoff % 10 == 0, "match halted");
    require(bettingStatus == 2, "odds not ready");
    require(userStruct[msg.sender].counter < 16, "betstack full, redeem bets");
    require(
      (_betAmt <= int64(userStruct[msg.sender].userBalance) &&
        _betAmt >= MIN_BET),
      "too big or too small"
    );
    require(uint256(startTime[_matchNumber]) > block.timestamp, "game started");
    uint64[4] memory _betData = decodeNumber(_matchNumber);
    if (_team0or1 == 0) {
      betPayoff = (_betAmt * betPayoff) / 10000;
    } else {
      betPayoff =
        (_betAmt * (ODDS_FACTOR1 / (betPayoff + ODDS_FACTOR2) - ODDS_FACTOR2)) /
        10000;
    }
    int64 currLpBetExposure = int64(_betData[2 + _team0or1]) -
      int64(_betData[1 - _team0or1]);
    require(
      (betPayoff + currLpBetExposure) <= int64(margin[0] / concFactor),
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
      "bet amount exceeds free capital"
    );
    userStruct[msg.sender].userBalance -= uint64(_betAmt);
    bytes32 subkID = keccak256(abi.encodePacked(nonce, block.number));
    Subcontract memory order;
    order.bettor = msg.sender;
    order.betAmount = uint64(_betAmt);
    order.payoff = uint64(betPayoff);
    order.pick = _team0or1;
    order.matchNum = _matchNumber;
    order.epoch = bettingEpoch;
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
    nonce++;
    userStruct[msg.sender].trades[userStruct[msg.sender].counter] = subkID;
    userStruct[msg.sender].counter++;
    emit BetRecord(
      msg.sender,
      bettingEpoch,
      _matchNumber,
      _team0or1,
      _betAmt,
      ((betPayoff * 95) / 100),
      subkID
    );
    return subkID;
  }

  /// @dev bettor funds account for bets
  function fundBettor() external payable {
    uint64 amt = uint64(msg.value / UNITS_TRANS14);
    require(amt >= MIN_DEPOSIT, "need at least one avax");
    userStruct[msg.sender].userBalance += amt;
    emit Funding(msg.sender, bettingEpoch, amt, 0);
  }

  /// @dev funds LP for supplying capital to take bets
  function fundBook() external payable {
    require(margin[2] == 0, "betting active");
    uint64 netinvestment = uint64(msg.value / UNITS_TRANS14);
    uint64 _shares = 0;
    require(netinvestment >= uint256(MIN_DEPOSIT), "need at least one avax");
    if (margin[0] > 0) {
      _shares = uint64(
        (uint256(netinvestment) * uint256(liqProvShares)) / uint256(margin[0])
      );
    } else {
      _shares = netinvestment;
    }
    margin[0] += uint64(netinvestment);
    lpStruct[msg.sender].lpEpoch = bettingEpoch;
    liqProvShares += _shares;
    lpStruct[msg.sender].shares += _shares;
    emit Funding(msg.sender, bettingEpoch, netinvestment, 1);
  }

  /** @dev bettor withdrawal
   * @param _amt is the bettor amount where 10000 = 1 avax
   */
  function withdrawBettor(uint64 _amt) external {
    require(_amt <= userStruct[msg.sender].userBalance);
    userStruct[msg.sender].userBalance -= _amt;
    uint256 amt256 = uint256(_amt) * UNITS_TRANS14;
    payable(msg.sender).transfer(amt256);
    emit Funding(msg.sender, bettingEpoch, _amt, 2);
  }

  /** @dev processes withdrawal by LPs
   * @param _sharesToSell is the LP's ownership stake withdrawn.
   */
  function withdrawBook(uint64 _sharesToSell) external {
    require(margin[2] == 0, "betting active");
    require(lpStruct[msg.sender].shares >= _sharesToSell, "NSF");
    require(bettingEpoch > lpStruct[msg.sender].lpEpoch, "no wd w/in epoch");
    uint64 avaxWithdraw = uint64(
      (uint256(_sharesToSell) * uint256(margin[0])) / uint256(liqProvShares)
    );
    require(
      avaxWithdraw <= (margin[0] - margin[1]),
      "insufficient free capital"
    );
    liqProvShares -= _sharesToSell;
    lpStruct[msg.sender].shares -= _sharesToSell;
    margin[0] -= avaxWithdraw;
    uint256 avaxWithdraw256 = uint256(avaxWithdraw) * UNITS_TRANS14;
    payable(msg.sender).transfer(avaxWithdraw256);
    emit Funding(msg.sender, bettingEpoch, avaxWithdraw, 3);
  }

  /** @dev redeems users bet stack of unredeemed bets
   */

  function redeem() external {
    uint256 numberBets = userStruct[msg.sender].counter;
    require(numberBets > 0, "no bets");
    uint64 payout = 0;
    for (uint256 i = 0; i < numberBets; i++) {
      bytes32 _subkId = userStruct[msg.sender].trades[i];
      if (betContracts[_subkId].epoch == bettingEpoch) revert("bets active");
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
    userStruct[msg.sender].userBalance += payout;
    emit Redemption(
      msg.sender,
      bettingEpoch,
      payout,
      userStruct[msg.sender].counter
    );
    userStruct[msg.sender].counter = 0;
  }

  /** @dev processes initial start times
   * @param _starts are the start times
   */
  function transmitInit(
    uint32[32] calldata _starts
  ) external onlyAdmin returns (bool) {
    startTime = _starts;
    bettingStatus = 1;
    return true;
  }

  /** @dev processes odds
   * @param _odds gross dec odds for favorite (team0)
   */
  function transmitOdds(
    uint16[32] calldata _odds
  ) external onlyAdmin returns (bool) {
    odds = _odds;
    bettingStatus = 2;
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
      winningTeam = uint32(_winner[i]);
      uint64[4] memory _betData = decodeNumber(i);
      if ((_betData[0] + _betData[1]) > 0) {
        epochMatch = i * 10 + bettingEpoch * 1000;
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
    bettingEpoch++;
    bettingStatus = 0;
    delete betData;
    payable(oracleAdmin).transfer(oracleDiv);
    return (bettingEpoch, oracleDiv);
  }

  /** @dev for distributing 60% of tokens to LPs. Once tokens are depleted 
 this is irrelevant. Tokens go to LP's external account address
   */
  function tokenReward() external {
    uint256 tokensLeft = token.balanceOf(address(this));
    require(tokensLeft > 0, "no token rewards left");
    //require(bettingEpoch > 5, "starts in epoch 6!");
    uint256 lpShares = uint256(lpStruct[msg.sender].shares);
    require(lpShares > 0, "only for liq providers");
    require(bettingEpoch > lpStruct[msg.sender].lpEpoch, "one claim per epoch");
    lpStruct[msg.sender].lpEpoch = bettingEpoch;
    uint256 _amt = ((lpShares * EPOCH_AMOUNT) / uint256(liqProvShares));
    if (_amt > tokensLeft) _amt = tokensLeft;
    token.transfer(msg.sender, _amt);
    emit Rewards(msg.sender, bettingEpoch, _amt);
  }

  /** @dev limits the amount of LP capital that can be applied to a single match.
   * @param _concFactor sets the parameter that defines how much diversification is enforced.
   * eg, if 10, then the max position allowed by bettors is LPcapital/_concFactor
   */
  function adjustConcentrationFactor(uint64 _concFactor) external onlyAdmin {
    concFactor = _concFactor;
  }

  /** @dev this allows oracle to prevent new bets on contests that have bad odds
   * @param _match is the reset match
   */
  function pauseMatch(uint256 _match) external onlyAdmin {
    uint16 oddsi = odds[_match] % 10;
    oddsi = (oddsi == 0) ? 1 : 0;
    odds[_match] = (odds[_match] / 10) * 10 + oddsi;
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

  /**  @dev this makes it easier for the front-end to present unredeemed bets
   * @param _userAddress is the account who is betting
   * @return _betDataUser is array of unredeemed bet bytes32 IDs
   */
  function showUserBetData(
    address _userAddress
  ) external view returns (bytes32[16] memory _betDataUser) {
    uint256 top = uint256(userStruct[_userAddress].counter);
    for (uint256 i = 0; i < top; i++) {
      _betDataUser[i] = userStruct[_userAddress].trades[i];
    }
  }

  /**  @dev this makes it easier for the front-end to present the status of past bets
   * @param _subkID is the contracts bytes32 ID created with bet
   * @return bool is true if the bet generated a win or tie and thus will
   * move money back to the user's balance
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

  /**  @dev unpacks uint256 to 4 uint64 to reveal match's bet amounts
   * @param _matchNumber is the match number from 0 to 31
   * 0 is amt bet on team0, 1 amt bet on team1, 2 payoff for team0, 3 payoff for team1
   */
  function decodeNumber(
    uint32 _matchNumber
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
