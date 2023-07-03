import { Router } from "express";
import {
  bettingBetRecordEventHandler,
  bettingFundingEventHandler,
  bettingOfferRecordEventHandler,
} from "../web3EventListeners/eventListeners/bettingContract/index.js";

const router = Router();

router.get(
  "/BetRecord",
  bettingBetRecordEventHandler.getAllRouteHandler(["bettor"])
);
router.get(
  "/OfferRecord",
  bettingOfferRecordEventHandler.getAllRouteHandler(["bettor"])
);
router.get(
  "/Funding",
  bettingFundingEventHandler.getAllRouteHandler(["bettor"])
);

export default router;
