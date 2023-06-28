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

export async function bettingContractEventListener() {
  const bettingBetRecordEventHandler = new EventHandler(
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
  const bettingOfferRecordEventHandler = new EventHandler(
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
  const bettingFundingEventHandler = new EventHandler(
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

  // sync old events
  await bettingBetRecordEventHandler.syncEventTillNow();
  await bettingOfferRecordEventHandler.syncEventTillNow();
  await bettingFundingEventHandler.syncEventTillNow();

  // start the event listener for the new events
}
