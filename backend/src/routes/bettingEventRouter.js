import { Router } from "express";
import {
  bettingBetRecordEventHandler,
  bettingFundingEventHandler,
  bettingOfferRecordEventHandler,
} from "../web3EventListeners/eventListeners/bettingContract/index.js";

const router = Router();

router.get(
  "/BetRecord",
  bettingBetRecordEventHandler.getAllRouteHandler.bind(
    bettingBetRecordEventHandler
  )
);
router.get(
  "/OfferRecord",
  bettingOfferRecordEventHandler.getAllRouteHandler.bind(
    bettingOfferRecordEventHandler
  )
);
router.get(
  "/Funding",
  bettingFundingEventHandler.getAllRouteHandler.bind(bettingFundingEventHandler)
);

export default router;
