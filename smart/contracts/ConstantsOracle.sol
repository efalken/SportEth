/**
SPDX-License-Identifier: MIT License
@author Eric G Falkenstein
*/
pragma solidity 0.8.19;

// hour of day in GMT one can post new data
uint32 constant HOUR_POST = 22;
// posts cannot be processed until after this hour, before above hour
uint32 constant HOUR_PROCESS = 12;
// odds on favorite must be lower than 2.0 in decimal odds
// odds in system are x=(decimalOdds -1)*1000
uint16 constant MAX_DEC_ODDS = 1000;
// odds on favorite must be higher than 1.125, lower odds events excluded
uint16 constant MIN_DEC_ODDS = 125;
// next post must be an initial slate post
uint8 constant STATUS_INIT = 0;
// next post must be an odds post
uint8 constant STATUS_ODDS = 1;
// next post must be an outcomes post  post
uint8 constant STATUS_SETTLE = 2;
// min amount for submitting data, 10% of supply
uint32 constant MIN_SUBMIT = 1e8;
// min deposit of 5% of token supply encourages token holders to join vaults,
uint32 constant MIN_TOKEN_DEPOSIT = 5e7;
//  encourages but does not guarantee independence among oracle accounts
uint32 constant MAX_TOKEN_DEPOSIT = 15e7;
// used to calculate next friday start, 9 PM GMT in seconds
uint32 constant FRIDAY_21_GMT = 1687554000;
// used to calculate next friday start
uint32 constant SECONDS_IN_HOUR = 3600;
uint32 constant SECONDS_IN_DAY = 86400;
uint32 constant SECONDS_TWO_DAYS = 172800;
uint32 constant SECONDS_FOUR_DAYS = 345600;
uint32 constant SECONDS_IN_WEEK = 604800;
