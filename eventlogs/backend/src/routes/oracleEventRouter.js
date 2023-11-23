import { Router } from "express";
import {
  oracleprobSpreadDiv2PostedEventHandler,
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
  "/probSpreadDiv2Posted",
  oracleprobSpreadDiv2PostedEventHandler.getAllRouteHandler()
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
