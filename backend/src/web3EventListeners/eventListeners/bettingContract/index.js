import { bettingContract } from "../../../config";

// event BetRecord(
//   address indexed bettor,
//   uint8 indexed epoch,
//   uint8 matchNum,
//   uint8 pick,
//   uint32 betAmount,
//   uint32 payoff,
//   bytes32 contractHash
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
  const BetRecordFilter = bettingContract.filters.BetRecord();
  const OfferRecordFilter = bettingContract.filters.OfferRecord();
  const FundingFilter = bettingContract.filters.Funding();

  // sync old events
  // start the event listener for the new events
}
