import { oracleContract } from "../../../config";

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
  const ResultsPostedFilter = oracleContract.filters.ResultsPosted();
  const DecOddsPostedFilter = oracleContract.filters.DecOddsPosted();
  const VoteOutcomeFilter = oracleContract.filters.VoteOutcome();
  const BetDataPostedFilter = oracleContract.filters.BetDataPosted();
  const ParamsPostedFilter = oracleContract.filters.ParamsPosted();
  const PausePostedFilter = oracleContract.filters.PausePosted();
  const StartTimesPostedFilter = oracleContract.filters.StartTimesPosted();
  const SchedulePostedFilter = oracleContract.filters.SchedulePosted();
  const FundingFilter = oracleContract.filters.Funding();

  // sync old events
  // start the event listener for the new events
}
