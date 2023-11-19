import { Router } from "express";
import {
  oracleDecOddsPostedEventHandler,
  oracleResultsPostedEventHandler,
  oracleSchedulePostedEventHandler,
  oracleStartTimesPostedEventHandler,
} from "../web3EventListeners/eventListeners/oracleContract/index.js";

const router = Router();

router.get(
  "/ResultsPosted",
  oracleResultsPostedEventHandler.getAllRouteHandler()
);
router.get(
  "/DecOddsPosted",
  oracleDecOddsPostedEventHandler.getAllRouteHandler()
);
router.get(
  "/StartTimesPosted",
  oracleStartTimesPostedEventHandler.getAllRouteHandler()
);
router.get(
  "/SchedulePosted",
  oracleSchedulePostedEventHandler.getAllRouteHandler()
);
export default router;
