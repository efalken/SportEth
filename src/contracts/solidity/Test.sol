// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test {
  uint256 public xxx;
  address public owner1;

  constructor() {
    owner1 = msg.sender;
  }

  receive() external payable {}

  function seeBalance() external view returns (uint256 _xxx) {
    _xxx = xxx;
  }

  function setData(uint256 _xxx) external returns (uint256 yyy) {
    require(owner1 == msg.sender);
    xxx = _xxx;
    yyy = xxx + 1;
  }
}
