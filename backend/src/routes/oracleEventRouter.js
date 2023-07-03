import { Router } from "express";
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
router.get("/VoteOutcome", oracleVoteOutcomeEventHandler.getAllRouteHandler());
router.get(
  "/BetDataPosted",
  oracleBetDataPostedEventHandler.getAllRouteHandler()
);
router.get(
  "/ParamsPosted",
  oracleParamsPostedEventHandler.getAllRouteHandler()
);
router.get("/PausePosted", oraclePausePostedEventHandler.getAllRouteHandler());
router.get(
  "/StartTimesPosted",
  oracleStartTimesPostedEventHandler.getAllRouteHandler()
);
router.get(
  "/SchedulePosted",
  oracleSchedulePostedEventHandler.getAllRouteHandler()
);
router.get("/Funding", oracleFundingEventHandler.getAllRouteHandler());
export default router;
