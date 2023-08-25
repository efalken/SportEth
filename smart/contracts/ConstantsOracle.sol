pragma solidity ^0.8.0;

//SPDX-License-Identifier: BUSL-1.1

// hour of day in GMT one can post new data for voting
uint32 constant HOUR_POST = 12;
// hour of day in GMT after whic one can submit a data proposal for processing
// minimum token requirement for data submissions
uint32 constant BURN_AMT = 2e6;
// max for initial favorite
uint16 constant MAX_DEC_ODDS_INIT = 1000;
uint16 constant MIN_DEC_ODDS_INIT = 110; // 150 in production
uint16 constant MAX_DEC_ODDS_UPDATE = 1250;
uint16 constant MIN_DEC_ODDS_UPDATE = 110;
// param to check if contract is voting on initial schedule & odds
uint8 constant STATUS_PROC_INIT = 10;
// param to check if contract is voting on an odds update
uint8 constant STATUS_PROC_UPDATE = 20;
// param to check if contract is voting on settlement submission
uint8 constant STATUS_PROC_SETTLE = 30;
// param to check if contract is post initial data submission, pre-settlement submission
uint8 constant STATUS_POST_2 = 2;
// keeps track of  who supplied data proposal, will be fined if data submission voted down
uint8 constant STATUS_POST_0 = 0;
// keeps track of  who supplied data proposal, will be fined if data submission voted down
uint256 constant EPOCH_AMOUNT = 3e7;
