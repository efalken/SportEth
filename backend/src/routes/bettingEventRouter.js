import { Router } from "express";
import {
  bettingBetRecordEventHandler,
  bettingFundingEventHandler,
  bettingOfferRecordEventHandler,
} from "../web3EventListeners/eventListeners/bettingContract/index.js";

const router = Router();

router.get(
  "/BetRecord",
  bettingBetRecordEventHandler.getAllRouteHandler(["bettor", "epoch"])
);
router.get(
  "/OfferRecord",
  bettingOfferRecordEventHandler.getAllRouteHandler(["bettor", "epoch"])
);
router.get(
  "/Funding",
  bettingFundingEventHandler.getAllRouteHandler(["bettor", "epoch"])
);

export default router;
