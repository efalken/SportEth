import { EventHandler } from "../../../EventHandler.js";
import { tokenContract } from "../../../config.js";

// event Transfer(address _from, address _to, uint64 _value);
// event Burn(address _from, uint64 _value);
// event Mint(address _from, uint64 _value);
// event Approval(address _owner, address _spender, uint64 _value);

export const tokenTransferEventHandler = new EventHandler(
  tokenContract,
  [
    ["_from", "from", "string"],
    ["_to", "to", "string"],
    ["_value", "value", "bigint"],
  ],
  "tokenTransferEvent",
  "Transfer"
);

export const tokenBurnEventHandler = new EventHandler(
  tokenContract,
  [
    ["_from", "from", "string"],
    ["_value", "value", "bigint"],
  ],
  "tokenBurnEvent",
  "Burn"
);

export const tokenMintEventHandler = new EventHandler(
  tokenContract,
  [
    ["_from", "from", "string"],
    ["_value", "value", "bigint"],
  ],
  "tokenMintEvent",
  "Mint"
);

export const tokenApprovalEventHandler = new EventHandler(
  tokenContract,
  [
    ["_owner", "owner", "string"],
    ["_spender", "spender", "string"],
    ["_value", "value", "bigint"],
  ],
  "tokenApprovalEvent",
  "Approval"
);

export async function tokenContractEventListener() {
  // sync old events and start the event listener for the new events
  await tokenTransferEventHandler.syncEvent();
  await tokenBurnEventHandler.syncEvent();
  await tokenMintEventHandler.syncEvent();
  await tokenApprovalEventHandler.syncEvent();
}
