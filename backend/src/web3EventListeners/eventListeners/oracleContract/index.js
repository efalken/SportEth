import { EventHandler } from "../../../EventHandler.js";
import { oracleContract } from "../../../config.js";

// event ResultsPosted(uint32 epoch, uint32 propnum, uint8[32] winner);

// event DecOddsPosted(uint32 epoch, uint32 propnum, uint32[32] decOdds);

// event VoteOutcome(
//   bool voteResult,
//   uint32 propnum,
//   uint32 epoch,
//   uint64 yesvotes,
//   uint64 novotes
// );

// event BetDataPosted(uint32 epoch, uint32 propnum, uint32[32] oddsStart);

// event ParamsPosted(uint32 concLimit);

// event PausePosted(uint8 pausedMatch1, uint8 pausedMatch2);

// event StartTimesPosted(uint32 propnum, uint32 epoch, uint32[32] starttimes);

// event SchedulePosted(uint32 epoch, uint32 propnum, string[32] sched);

// event Funding(uint64 tokensChange, uint256 etherChange, address transactor);

export async function oracleContractEventListener() {
  const oracleResultsPostedEventHandler = new EventHandler(
    oracleContract,
    [
      ["epoch", "epoch", "int"],
      ["propnum", "propnum", "int"],
      ["winner", "winner", "int[]"],
    ],
    "oracleResultsPostedEvent",
    "ResultsPosted"
  );
  const oracleDecOddsPostedEventHandler = new EventHandler(
    oracleContract,
    [
      ["epoch", "epoch", "int"],
      ["propnum", "propnum", "int"],
      ["decOdds", "decOdds", "int[]"],
    ],
    "oracleDecOddsPostedEvent",
    "DecOddsPosted"
  );
  const oracleVoteOutcomeEventHandler = new EventHandler(
    oracleContract,
    [
      ["epoch", "epoch", "int"],
      ["propnum", "propnum", "int"],
      ["voteResult", "voteResult", "bool"],
      ["yesvotes", "yesvotes", "bigint"],
      ["novotes", "novotes", "bigint"],
    ],
    "oracleVoteOutcomeEvent",
    "VoteOutcome"
  );
  const oracleBetDataPostedEventHandler = new EventHandler(
    oracleContract,
    [
      ["epoch", "epoch", "int"],
      ["propnum", "propnum", "int"],
      ["oddsStart", "oddsStart", "int[]"],
    ],
    "oracleBetDataPostedEvent",
    "BetDataPosted"
  );
  const oracleParamsPostedEventHandler = new EventHandler(
    oracleContract,
    [["concLimit", "concLimit", "int"]],
    "oracleParamsPostedEvent",
    "ParamsPosted"
  );
  const oraclePausePostedEventHandler = new EventHandler(
    oracleContract,
    [
      ["pausedMatch1", "pausedMatch1", "int"],
      ["pausedMatch2", "pausedMatch2", "int"],
    ],
    "oraclePausePostedEvent",
    "PausePosted"
  );
  const oracleStartTimesPostedEventHandler = new EventHandler(
    oracleContract,
    [
      ["epoch", "epoch", "int"],
      ["propnum", "propnum", "int"],
      ["starttimes", "starttimes", "int[]"],
    ],
    "oracleStartTimesPostedEvent",
    "StartTimesPosted"
  );
  const oracleSchedulePostedEventHandler = new EventHandler(
    oracleContract,
    [
      ["epoch", "epoch", "int"],
      ["propnum", "propnum", "int"],
      ["sched", "sched", "int[]"],
    ],
    "oracleSchedulePostedEvent",
    "SchedulePosted"
  );
  const oracleFundingEventHandler = new EventHandler(
    oracleContract,
    [
      ["tokensChange", "tokensChange", "bigint"],
      ["etherChange", "etherChange", "bigint"],
      ["transactor", "transactor", "string"],
    ],
    "oracleFundingEvent",
    "Funding"
  );

  // sync old events and start the event listener for the new events
  await oracleResultsPostedEventHandler.syncEvent();
  await oracleDecOddsPostedEventHandler.syncEvent();
  await oracleVoteOutcomeEventHandler.syncEvent();
  await oracleBetDataPostedEventHandler.syncEvent();
  await oracleParamsPostedEventHandler.syncEvent();
  await oraclePausePostedEventHandler.syncEvent();
  await oracleStartTimesPostedEventHandler.syncEvent();
  await oracleSchedulePostedEventHandler.syncEvent();
  await oracleFundingEventHandler.syncEvent();
}
