import { Router } from "express";
import {
  bettingBetRecordEventHandler,
  bettingFundingEventHandler,
  bettingOfferRecordEventHandler,
} from "../web3EventListeners/eventListeners/bettingContract";
import {
  oracleBetDataPostedEventHandler,
  oracleDecOddsPostedEventHandler,
  oracleFundingEventHandler,
  oracleParamsPostedEventHandler,
  oraclePausePostedEventHandler,
  oracleResultsPostedEventHandler,
  oracleSchedulePostedEventHandler,
  oracleStartTimesPostedEventHandler,
  oracleVoteOutcomeEventHandler,
} from "../web3EventListeners/eventListeners/oracleContract";
import {
  tokenApprovalEventHandler,
  tokenBurnEventHandler,
  tokenMintEventHandler,
  tokenTransferEventHandler,
} from "../web3EventListeners/eventListeners/tokenContract";

const router = Router();

router.post("/", async (req, res) => {
  const { transactionHash } = req.body;
  let transactionReceipt;
  try {
    transactionReceipt = await provider.getTransactionReceipt(transactionHash);
  } catch (err) {}
  if (!transactionReceipt) {
    return res.status(400).json({ message: "invalid transaction hash" });
  }

  await Promise.all([
    bettingBetRecordEventHandler.syncEventsFromTransaction(transactionReceipt),
    bettingOfferRecordEventHandler.syncEventsFromTransaction(
      transactionReceipt
    ),
    bettingFundingEventHandler.syncEventsFromTransaction(transactionReceipt),
    oracleBetDataPostedEventHandler.syncEventsFromTransaction(
      transactionReceipt
    ),
    oracleDecOddsPostedEventHandler.syncEventsFromTransaction(
      transactionReceipt
    ),
    oracleFundingEventHandler.syncEventsFromTransaction(transactionReceipt),
    oracleParamsPostedEventHandler.syncEventsFromTransaction(
      transactionReceipt
    ),
    oraclePausePostedEventHandler.syncEventsFromTransaction(transactionReceipt),
    oracleStartTimesPostedEventHandler.syncEventsFromTransaction(
      transactionReceipt
    ),
    oracleVoteOutcomeEventHandler.syncEventsFromTransaction(transactionReceipt),
    oracleResultsPostedEventHandler.syncEventsFromTransaction(
      transactionReceipt
    ),
    oracleSchedulePostedEventHandler.syncEventsFromTransaction(
      transactionReceipt
    ),
    tokenApprovalEventHandler.syncEventsFromTransaction(transactionReceipt),
    tokenBurnEventHandler.syncEventsFromTransaction(transactionReceipt),
    tokenTransferEventHandler.syncEventsFromTransaction(transactionReceipt),
    tokenMintEventHandler.syncEventsFromTransaction(transactionReceipt),
  ]);

  res.json({ message: "events synced" });
});

export default router;
