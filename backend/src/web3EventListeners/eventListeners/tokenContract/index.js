import { tokenContract } from "../../../config";

// event Transfer(address _from, address _to, uint64 _value);
// event Burn(address _from, uint64 _value);
// event Mint(address _from, uint64 _value);
// event Approval(address _owner, address _spender, uint64 _value);

export async function tokenContractEventListener() {
  const TransferFilter = tokenContract.filters.Transfer();
  const BurnFilter = tokenContract.filters.Burn();
  const MintFilter = tokenContract.filters.Mint();
  const ApprovalFilter = tokenContract.filters.Approval();

  // sync old events
  // start the event listener for the new events
}
