pragma solidity ^0.8.0;

//SPDX-License-Identifier: BUSL-1.1

uint256 constant UNITS_TRANS14 = 1e14;
  // puts UTC ahead of now 
uint32 constant FUTURE_START = 2e9;
  // used to generate oracle payment
uint256 constant ORACLE_5PERC = 5e12;
uint32 constant MIN_BET = 10; // 1 finney aka 0.001 ETH
uint32 constant MIN_LP_DURATION = 0; // SET TO 2 IN PROD

