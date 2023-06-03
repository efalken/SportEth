pragma solidity ^0.8.0;

//SPDX-License-Identifier: BUSL-1.1

  // hour of day in GMT one can post new data for voting
  uint32 constant HOUR_POST = 0;// 12 in prod
  // hour of day in GMT after whic one can submit a data proposal for processing
  uint32 constant HOUR_PROCESS = 0; // 18 in prod
  // minimum token requirement for data submissions
  uint32 constant MIN_SUBMIT = 5e7;
  uint64 constant ONE_MILLION = 1e6;
  // max for initial favorite 
  uint32 constant MAX_DEC_ODDS_INIT = 1000;
  // min odds for initial data submission
  uint32 constant MIN_DEC_ODDS_INIT = 125;
  uint32 constant MAX_DEC_ODDS_UPDATE = 1500;
  uint32 constant MIN_DEC_ODDS_UPDATE = 110;
  // parameter that enforces vig by applying to favorite 1e6/(odds + 41) - 41
  uint32 constant ODDS_FACTOR = 41;
  // param to check if contract is voting on initial schedule & odds
  uint32 constant INIT_PROC_NEXT = 10;
  // param to check if contract is voting on an odds update
  uint32 constant UPDATE_PROC_NEXT = 20;
  // param to check if contract is voting on settlement submission
  uint32 constant SETTLE_PROC_NEXT = 30;
  // param to check if contract is post initial data submission, pre-settlement submission
  uint32 constant ACTIVE_STATE = 2;
  // keeps track of  who supplied data proposal, will be fined if data submission voted down


