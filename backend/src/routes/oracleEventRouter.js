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
  oracleResultsPostedEventHandler.getAllRouteHandler.bind(
    oracleResultsPostedEventHandler
  )
);
router.get(
  "/DecOddsPosted",
  oracleDecOddsPostedEventHandler.getAllRouteHandler.bind(
    oracleDecOddsPostedEventHandler
  )
);
router.get(
  "/VoteOutcome",
  oracleVoteOutcomeEventHandler.getAllRouteHandler.bind(
    oracleVoteOutcomeEventHandler
  )
);
router.get(
  "/BetDataPosted",
  oracleBetDataPostedEventHandler.getAllRouteHandler.bind(
    oracleBetDataPostedEventHandler
  )
);
router.get(
  "/ParamsPosted",
  oracleParamsPostedEventHandler.getAllRouteHandler.bind(
    oracleParamsPostedEventHandler
  )
);
router.get(
  "/PausePosted",
  oraclePausePostedEventHandler.getAllRouteHandler.bind(
    oraclePausePostedEventHandler
  )
);
router.get(
  "/StartTimesPosted",
  oracleStartTimesPostedEventHandler.getAllRouteHandler.bind(
    oracleStartTimesPostedEventHandler
  )
);
router.get(
  "/SchedulePosted",
  oracleSchedulePostedEventHandler.getAllRouteHandler.bind(
    oracleSchedulePostedEventHandler
  )
);
router.get(
  "/Funding",
  oracleFundingEventHandler.getAllRouteHandler.bind(oracleFundingEventHandler)
);

export default router;
