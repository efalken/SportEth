import { EventHandler } from "../../../EventHandler.js";
import { bettingContract } from "../../../config.js";

// event BetRecord(
//   address indexed bettor,
//   uint8 indexed epoch,
//   uint8 matchNum,
//   uint8 pick,
//   uint32 betAmount,
//   uint32 payoff,
//   bytes32 contractHash,
// );

// event OfferRecord(
//   address indexed bettor,
//   uint8 indexed epoch,
//   uint8 matchNum,
//   uint8 pick,
//   uint32 betAmount,
//   uint32 payoff,
//   bytes32 contractHash
// );

// event Funding(
//   address bettor,
//   uint256 moveAmount,
//   uint32 epoch,
//   uint32 action
// );

export const bettingBetRecordEventHandler = new EventHandler(
  bettingContract,
  [
    ["bettor", "bettor", "string"],
    ["epoch", "epoch", "int"],
    ["matchNum", "matchNum", "int"],
    ["pick", "pick", "int"],
    ["betAmount", "betAmount", "int"],
    ["payoff", "payoff", "int"],
    ["contractHash", "contractHash", "string"],
  ],
  "bettingBetRecordEvent",
  "BetRecord"
);

export const bettingOfferRecordEventHandler = new EventHandler(
  bettingContract,
  [
    ["bettor", "bettor", "string"],
    ["epoch", "epoch", "int"],
    ["matchNum", "matchNum", "int"],
    ["pick", "pick", "int"],
    ["betAmount", "betAmount", "int"],
    ["payoff", "payoff", "int"],
    ["contractHash", "contractHash", "string"],
  ],
  "bettingOfferRecordEvent",
  "OfferRecord"
);

export const bettingFundingEventHandler = new EventHandler(
  bettingContract,
  [
    ["bettor", "bettor", "string"],
    ["moveAmount", "moveAmount", "bigint"],
    ["epoch", "epoch", "int"],
    ["action", "action", "int"],
  ],
  "bettingFundingEvent",
  "Funding"
);

export async function bettingContractEventListener() {
  // sync old events and start the event listener for the new events
  await bettingBetRecordEventHandler.syncEvent();
  await bettingOfferRecordEventHandler.syncEvent();
  await bettingFundingEventHandler.syncEvent();
}
