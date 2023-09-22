/**
SPDX-License-Identifier: MIT License
@author Eric G Falkenstein
*/
pragma solidity 0.8.19;

//1e4 is 1 avax in contract
int64 constant MIN_BET = 1e4;
uint64 constant MIN_DEPOSIT = 1e4;
// used to transform gross odds on favorite, team 0,
// to odds on dog, team 1
int64 constant ODDS_FACTOR1 = 1e8;
int64 constant ODDS_FACTOR2 = 450;
// 1 avax = 1e18 while in contract 1 eth = 1e4, this adjusts avax deposits
uint256 constant UNITS_TRANS14 = 1e14;
// adjusts eth sent to oracle number, 5e12 is 5% of 1e14
uint256 constant ORACLE_5PERC = 5e12;
// 30k tokens allocated for rewards each epoch, given 3 decimals
uint256 constant EPOCH_AMOUNT = 3e7;
