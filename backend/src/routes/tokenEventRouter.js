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
  tokenTransferEventHandler.getAllRouteHandler(["from", "to"])
);
router.get("/Burn", tokenBurnEventHandler.getAllRouteHandler(["from"]));
router.get("/Mint", tokenMintEventHandler.getAllRouteHandler(["from"]));
router.get(
  "/Approval",
  tokenApprovalEventHandler.getAllRouteHandler(["owner", "spender"])
);

export default router;
