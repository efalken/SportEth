import { ethers } from "ethers";
import dotenv from "dotenv";

import OracleContractConfig from "./abis/Oracle.json" assert { type: "json" };

dotenv.config();

export const PORT = Number(process.env.PORT || "8000");

export const rpcURI = process.env.RPC_URI || "";
export const provider = new ethers.WebSocketProvider(rpcURI);

console.log(rpcURI);

export const { chainId } = await provider.getNetwork();

export const oracleContractAddress =
  process.env.ORACLE_CONTRACT_ADDRESS ||
  OracleContractConfig.networks[chainId].address ||
  "";

export const oracleContract = new ethers.Contract(
  oracleContractAddress,
  OracleContractConfig.abi,
  provider
);

export const minBlock = Number(process.env.MIN_BLOCK || "0");
