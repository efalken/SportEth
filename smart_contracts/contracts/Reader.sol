pragma solidity ^0.8.0;

/**
SPDX-License-Identifier: MIT
@author Eric Falkenstein
*/

import "./Oracle.sol";
import "./Betting.sol";

contract Reader {
  Oracle public oraclek;
  Betting public bettingk;

  constructor(address payable _betting, address payable _oracle) {
    oraclek = Oracle(_oracle);
    bettingk = Betting(_betting);
  }

  function checkSingleBet(
    bytes32 _subkID
  )
    external
    view
    returns (
      uint8 _epoch,
      uint8 _matchNum,
      uint8 _pick,
      uint32 _betAmount,
      uint32 _payoff,
      address _bettor
    )
  {
    (_epoch, _matchNum, _pick, _betAmount, _payoff, _bettor) = bettingk
      .betContracts(_subkID);
  }

  function checkOffer(bytes32 _subkID) external view returns (bool) {
    (, , , uint32 betamt, , ) = bettingk.offerContracts(_subkID);
    bool takeable = (betamt > 0);
    return takeable;
  }

  function checkRedeem(bytes32 _subkID) external view returns (bool) {
    (uint8 epoch, uint8 matchNum, uint8 pick, , , ) = bettingk.betContracts(
      _subkID
    );
    uint32 epochMatch = epoch * 1000 + matchNum * 10 + pick;
    bool redeemable = (bettingk.outcomeMap(epochMatch) > 0);
    return redeemable;
  }

  function showBetData(uint256 _match) external view returns (uint256 betData) {
    betData = bettingk.betData(_match);
  }

  // function showBigBetData(bytes32 _subkid)
  //   external
  //   view
  //   returns (uint32[7] memory matchData)
  // {
  //     (uint8 epoch, uint8 matchNum, uint8 pick, uint32 betAmount, uint32 payoff, address bettor) = bettingk.offerContracts(_subkid);
  // (uint32 favelong, uint32 undlong, uint32 favepayout, uint32 undpayout, uint32 startTime, uint32 faveodds, uint32 undodds) = bettingk.offerContracts(_matchNumber);
  //uint256 x = bettingk.offerContracts(matchData);
  //matchData = decodeNumber(x);
  //matchData = bettingk.betData(x);
  // matchData = [favelong, undlong, favepayout, undpayout, startTime, faveodds, undodds];
  // return decodedMatch;
  //betdata = bettingk.betData(x);
  //return betdata;
  //}

  function hourOfDay() external view returns (uint256 hour) {
    hour = (block.timestamp % 86400) / 3600;
  }

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

  function showSchedString(
    uint256 i
  ) external view returns (string memory matchDescription) {
    matchDescription = oraclek.matchSchedule(i);
  }

  function create96(
    uint32[32] memory _time,
    uint32[32] memory _odds
  ) internal pure returns (uint96[32] memory outv) {
    uint32 opponentOdds;
    uint96 out;
    for (uint256 i = 0; i < 32; i++) {
      if (_time[i] != 0) {
        opponentOdds = 1e6 / (42 + _odds[i]) - 42;
        out |= uint96(_time[i]) << 64;
        out |= uint96(_odds[i]) << 32;
        out |= uint96(opponentOdds);
        outv[i] = out;
      }
      delete out;
    }
  }
}
