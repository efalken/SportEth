import { Router } from "express";
import {
  tokenApprovalEventHandler,
  tokenBurnEventHandler,
  tokenMintEventHandler,
  tokenTransferEventHandler,
} from "../web3EventListeners/eventListeners/tokenContract/index.js";

const router = Router();

router.get(
  "/Transfer",
  tokenTransferEventHandler.getAllRouteHandler.bind(tokenTransferEventHandler)
);
router.get(
  "/Burn",
  tokenBurnEventHandler.getAllRouteHandler.bind(tokenBurnEventHandler)
);
router.get(
  "/Mint",
  tokenMintEventHandler.getAllRouteHandler.bind(tokenMintEventHandler)
);
router.get(
  "/Approval",
  tokenApprovalEventHandler.getAllRouteHandler.bind(tokenApprovalEventHandler)
);

export default router;
