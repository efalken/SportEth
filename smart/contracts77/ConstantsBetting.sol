/**
SPDX-License-Identifier: MIT License
@author Eric G Falkenstein
*/
pragma solidity 0.8.19;

//1e4 is 1 avax in contract
int64 constant MIN_BET = 1e4;
uint64 constant MIN_DEPOSIT = 1e4;
// 1 avax = 1e18 while in contract 1 eth = 1e4, this adjusts avax deposits
uint256 constant UNITS_TRANS14 = 1e14;
// adjusts eth sent to oracle number, 5e12 is 5% of 1e14
uint256 constant ORACLE_5PERC = 5e12;
// 30k tokens allocated for rewards each epoch, given 3 decimals
uint256 constant EPOCH_AMOUNT = 3e7;
uint32 constant MAX_BETS = 16;
