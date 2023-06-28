import { EventHandler } from "../../../EventHandler.js";
import { tokenContract } from "../../../config.js";

// event Transfer(address _from, address _to, uint64 _value);
// event Burn(address _from, uint64 _value);
// event Mint(address _from, uint64 _value);
// event Approval(address _owner, address _spender, uint64 _value);

export async function tokenContractEventListener() {
  const tokenTransferEventHandler = new EventHandler(
    tokenContract,
    [
      ["_from", "from", "string"],
      ["_to", "to", "string"],
      ["_value", "value", "bigint"],
    ],
    "tokenTransferEvent",
    "Transfer"
  );
  const tokenBurnEventHandler = new EventHandler(
    tokenContract,
    [
      ["_from", "from", "string"],
      ["_value", "value", "bigint"],
    ],
    "tokenBurnEvent",
    "Burn"
  );
  const tokenMintEventHandler = new EventHandler(
    tokenContract,
    [
      ["_from", "from", "string"],
      ["_value", "value", "bigint"],
    ],
    "tokenMintEvent",
    "Mint"
  );
  const tokenApprovalEventHandler = new EventHandler(
    tokenContract,
    [
      ["_owner", "owner", "string"],
      ["_spender", "spender", "string"],
      ["_value", "value", "bigint"],
    ],
    "tokenApprovalEvent",
    "Approval"
  );

  // sync old events and start the event listener for the new events
  await tokenTransferEventHandler.syncEvent();
  await tokenBurnEventHandler.syncEvent();
  await tokenMintEventHandler.syncEvent();
  await tokenApprovalEventHandler.syncEvent();
}
