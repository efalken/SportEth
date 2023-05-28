pragma solidity ^0.8.0;

/**
SPDX-License-Identifier: MIT
@author Eric Falkenstein
*/

import "./Oracle.sol";
import "./Betting.sol";

contract ReadSportEth {
  Oracle public oraclek;
  Betting public bettingk;

  constructor(address payable _betting, address payable _oracle) {
    oraclek = Oracle(_oracle);
    bettingk = Betting(_betting);
  }

  function checkRedeem(bytes32 _subkID) external view returns (bool) {
    (uint8 epoch, uint8 matchNum, uint8 pick, , , ) = bettingk.betContracts(
      _subkID
    );
    uint32 epochMatch = epoch * 1000 + matchNum * 10 + pick;
    bool redeemable = (bettingk.outcomeMap(epochMatch) > 0);
    return redeemable;
  }

  function checkSingleBet(bytes32 _subkID)
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
    // _epoch = bettingk.betContracts[_subkID].epoch;
    // _matchNum = bettingk.betContracts[_subkID].matchNum;
    // _pick = bettingk.betContracts[_subkID].pick;
    // _betAmount = bettingk.betContracts[_subkID].betAmount;
    // _payoff = bettingk.betContracts[_subkID].payoff;
    // _bettor = bettingk.betContracts[_subkID].bettor;
  }

  function checkOffer(bytes32 _subkID) external view returns (bool) {
    (, , , uint32 betamt, , ) = bettingk.offerContracts(_subkID);
    bool takeable = (betamt > 0);
    return takeable;
  }

  function showBetData(uint256 _matchNumber)
    external
    view
    returns (uint32[7] memory matchData)
  {
    matchData = decodeNumber(bettingk.betData(_matchNumber));
    //betdata = bettingk.betData(_i);
    //return betdata;
  }

  function hourOfDay() external view returns (uint256 hour) {
    hour = (block.timestamp % 86400) / 3600;
  }

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

  function showSchedString(uint256 i)
    external
    view
    returns (string memory matchDescription)
  {
    matchDescription = oraclek.matchSchedule(i);
  }
}
