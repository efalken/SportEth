pragma solidity ^0.8.0;

//SPDX-License-Identifier: BUSL-1.1

uint256 constant UNITS_TRANS14 = 1e14; // 1e14 in prod, 1e10 test
uint256 constant ORACLE_5PERC = 5e12; // 5e12 in prod, 5e8 test
// puts UTC ahead of now
uint32 constant FUTURE_START = 2e9;
// used to generate oracle payment
int64 constant MIN_BET = 1000; // 10000 is 1 avax
uint64 constant MIN_BET_DEPOSIT = 10000;
uint32 constant MIN_LP_DURATION = 2;
int64 constant ODDS_FACTOR = 45;
uint256 constant EPOCH_AMOUNT = 3e7;
