import BettingContractConfig from "./abis/Betting.json";
import OracleContractConfig from "./abis/Oracle.json";
import TokenContractConfig from "./abis/Token.json";

export const PORT = Number(process.env.PORT || "8000");

export const rpcURI = process.env.RPC_URI || "";
export const provider = new ethers.WebSocketProvider(rpcURI);

export const { chainId } = await provider.getNetwork();

export const bettingContractAddress =
  process.env.BETTING_CONTRACT_ADDRESS ||
  BettingContractConfig.networks[chainId].address ||
  "";
export const oracleContractAddress =
  process.env.ORACLE_CONTRACT_ADDRESS ||
  OracleContractConfig.networks[chainId].address ||
  "";
export const tokenContractAddress =
  process.env.TOKEN_CONTRACT_ADDRESS ||
  TokenContractConfig.networks[chainId].address ||
  "";

export const bettingContract = new ethers.Contract(
  bettingContractAddress,
  BettingContractConfig.abi,
  provider
);
export const oracleContract = new ethers.Contract(
  oracleContractAddress,
  OracleContractConfig.abi,
  provider
);
export const tokenContract = new ethers.Contract(
  tokenContractAddress,
  TokenContractConfig.abi,
  provider
);
