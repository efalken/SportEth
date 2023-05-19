pragma solidity ^0.8.0;

/**
SPDX-License-Identifier: MIT
@author Eric Falkenstein
*/

contract CheckHour {

  constructor() {
  }

  function hourOfDay() external view returns (uint256 hour) {
    hour = (block.timestamp % 86400) / 3600;
  }

}
