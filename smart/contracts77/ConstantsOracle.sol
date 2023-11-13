/**
SPDX-License-Identifier: MIT License
@author Eric G Falkenstein
*/
pragma solidity 0.8.19;

// odds on favorite must be lower than 2.0 in decimal odds
// odds in system are x=(decimalOdds -1)*1000
uint16 constant MAX_DEC_ODDS = 388;
// odds on favorite must be higher than 1.125, lower odds events excluded
uint16 constant MIN_DEC_ODDS = 40;
// min deposit of 5% of token supply encourages token holders to join vaults,
uint32 constant MIN_TOKEN_DEPOSIT = 10e7;
//  encourages but does not guarantee independence among oracle accounts
uint32 constant MAX_TOKEN_DEPOSIT = 22e7;
// used to calculate next friday start, 9 PM GMT, 4 PM ET, in seconds
uint32 constant FRIDAY_21_GMT = 1687554000;
// used to calculate next friday start
uint32 constant SECONDS_IN_HOUR = 3600;
uint32 constant SECONDS_IN_DAY = 86400;
uint32 constant SECONDS_FOUR_DAYS = 345600;
uint32 constant SECONDS_IN_WEEK = 604800;
uint32 constant SECONDS_TWO_DAYS = 216000;
// voting can only occur at an hour greater than or equal to 15
uint256 constant GMT_15 = 15;
// voting can only occur after this hour
// posting can only occur before or equal that
uint256 constant GMT_2 = 2;
// for concentration factor
uint256 constant MAX_EVENTS = 32;
// oracle can choose what is best. Can change, say, for big event like super bowl
uint64 constant MAX_CONC_FACTOR = 16;
uint64 constant MIN_CONC_FACTOR = 2;
