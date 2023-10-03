import { EventHandler } from "../../../EventHandler.js";
import { oracleContract } from "../../../config.js";

// event ResultsPosted(uint32 epoch, uint32 propnum, uint8[32] winner);

// event DecOddsPosted(uint32 epoch, uint32 propnum, uint16[32] decOdds);

// event SchedulePosted(uint32 epoch, uint32 propnum, string[32] sched);

// event StartTimesPosted(uint32 epoch, uint32 propnum, uint32[32] starttimes);

export const oracleResultsPostedEventHandler = new EventHandler(
  oracleContract,
  [
    ["epoch", "epoch", "int"],
    ["propnum", "propnum", "int"],
    ["winner", "winner", "int[]"],
  ],
  "oracleResultsPostedEvent",
  "ResultsPosted"
);

export const oracleDecOddsPostedEventHandler = new EventHandler(
  oracleContract,
  [
    ["epoch", "epoch", "int"],
    ["propnum", "propnum", "int"],
    ["decOdds", "decOdds", "int[]"],
  ],
  "oracleDecOddsPostedEvent",
  "DecOddsPosted"
);

export const oracleStartTimesPostedEventHandler = new EventHandler(
  oracleContract,
  [
    ["epoch", "epoch", "int"],
    ["propnum", "propnum", "int"],
    ["starttimes", "starttimes", "int[]"],
  ],
  "oracleStartTimesPostedEvent",
  "StartTimesPosted"
);

export const oracleSchedulePostedEventHandler = new EventHandler(
  oracleContract,
  [
    ["epoch", "epoch", "int"],
    ["propnum", "propnum", "int"],
    ["sched", "sched", "string[]"],
  ],
  "oracleSchedulePostedEvent",
  "SchedulePosted"
);

export async function oracleContractEventListener() {
  // sync old events and start the event listener for the new events
  await oracleResultsPostedEventHandler.syncEvent();
  await oracleDecOddsPostedEventHandler.syncEvent();
  await oracleStartTimesPostedEventHandler.syncEvent();
  await oracleSchedulePostedEventHandler.syncEvent();
}
