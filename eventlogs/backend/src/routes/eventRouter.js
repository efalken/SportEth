import { Router } from "express";
import {
  oracleprobSpreadDiv2PostedEventHandler,
  oracleResultsPostedEventHandler,
  oracleSchedulePostedEventHandler,
  oracleStartTimesPostedEventHandler,
} from "../web3EventListeners/eventListeners/oracleContract/index.js";

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
    oracleprobSpreadDiv2PostedEventHandler.syncEventsFromTransaction(
      transactionReceipt
    ),
    oracleStartTimesPostedEventHandler.syncEventsFromTransaction(
      transactionReceipt
    ),
    oracleResultsPostedEventHandler.syncEventsFromTransaction(
      transactionReceipt
    ),
    oracleSchedulePostedEventHandler.syncEventsFromTransaction(
      transactionReceipt
    ),
  ]);

  res.json({ message: "events synced" });
});

export default router;
