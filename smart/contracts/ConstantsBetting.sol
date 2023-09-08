/**
SPDX-License-Identifier: MIT License
@author Eric Falkenstein
*/
pragma solidity 0.8.19;

// puts UTC ahead of now, allowing LPs to wd after settle
uint32 constant FUTURE_START = 2e9;
//10000 is 1 avax in contract
int64 constant MIN_BET = 10000;
// used to calculate next friday events start
uint32 constant FRIDAY_22_GMT = 1687557600;
uint64 constant MIN_BET_DEPOSIT = 10000;
// used to transform gross odds on favorite, team 0,
// to odds on dog, team 1
int64 constant ODDS_FACTOR = 45;
// 30k tokens allocated each epoch
uint256 constant EPOCH_AMOUNT = 3e7;
// 1e14 in production and hardhat tests, 1e10 for testnet to save on test avax
// 1 eth = 1e18 to 1 eth = 1e4, allowing balances in uint64
uint256 constant UNITS_TRANS14 = 1e14;
// adjusts eth sent to oracle number, 5e12 is 5% of 1e14
uint256 constant ORACLE_5PERC = 5e12;
// makes it so LPs cannot wd for 3 epochs
uint32 constant MIN_LP_DURATION = 2;
// used to generate next game start time,
uint32 constant WEEK_IN_SECONDS = 604800;
