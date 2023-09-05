/**
SPDX-License-Identifier: MIT License
@author Eric Falkenstein
*/
pragma solidity ^0.8.0;

// hour of day in GMT one can post new data
// also max hour for when data posts can be processed
uint32 constant HOUR_POST = 12;
// penalty for failed data submission
uint32 constant BURN_AMT = 2e6;
// min/max for initial favorite
uint16 constant MAX_DEC_ODDS_INIT = 1000;
uint16 constant MIN_DEC_ODDS_INIT = 125;
// min/max for updates to favorite
uint16 constant MAX_DEC_ODDS_UPDATE = 1200;
uint16 constant MIN_DEC_ODDS_UPDATE = 75;
// tells processVote() to process init post
uint8 constant STATUS_PROC_INIT = 10;
// tells processVote() to process update post
uint8 constant STATUS_PROC_UPDATE = 20;
// tells processVote() to process settle
uint8 constant STATUS_PROC_SETTLE = 30;
// only an odds update or settlement post allowed
uint8 constant STATUS_POST_2 = 2;
// only an initial slate post possible
uint8 constant STATUS_POST_0 = 0;
/* this encourages token holders to join vaults, which make it
 oracle depositors need at least 4% of tokens to deposit and claim revenue
*/
uint32 constant MIN_DEPOSIT = 4e7;
// min amount for submitting data, 10% of supply
uint32 constant MIN_SUBMIT = 1e8;
//  prevents any oracle account from being greater than 14% of oracle
uint32 constant MAX_DEPOSIT = 15e8;
