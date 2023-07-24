pragma solidity ^0.8.0;

//SPDX-License-Identifier: BUSL-1.1

uint256 constant UNITS_TRANS14 = 1e10;// 1e14 in prod
uint256 constant ORACLE_5PERC = 5e8;  // 5e12 in prod
// puts UTC ahead of now
uint32 constant FUTURE_START = 2e9;
// used to generate oracle payment
int64 constant MIN_BET = 10; // 10000 finney aka 0.001 ETH
uint32 constant MIN_LP_DURATION = 0; // SET TO 2 IN PROD
int64 constant ODDS_FACTOR = 50; // SET TO 2 IN PROD
int64 constant MMA_ADJ = 90; // SET TO 2 IN PROD
int64 constant FOOTBALL_ADJ = 95; // SET TO 2 IN PROD
