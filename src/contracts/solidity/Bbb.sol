pragma solidity ^0.8.0;

/**
SPDX-License-Identifier: MIT
@author Eric Falkenstein
*/

contract Bbb {
  uint256 public paramsb;

  //address payable public aaa;

  constructor() {}

  /// @dev initial deployment sets administrator as the Oracle contract

  function sendEth() external payable {}

  receive() external payable {}

  function seeBalance() external view returns (uint256 ethHere) {
    ethHere = address(this).balance;
  }

  function pullOnly(uint256 _params) external {
    paramsb = _params;
  }

  function pullPay(uint256 _params) external {
    paramsb = _params;
    (bool success, ) = payable(address(msg.sender)).call{ value: 99 }("");
    /* (bool success, ) = payable(address(msg.sender)).call.value(99).gas(5000000)();*/
    require(success);
    //  return (paramsb[0] + 1, paramsb[1] + 2);
  }

  function pullGet(uint256 _params) external returns (uint256 a, uint32 b) {
    paramsb = _params;
    a = paramsb;
    b = uint32(paramsb + 3);
  }
}
