import { bettingContractEventListener } from "./eventListeners/bettingContract/index.js";
import { oracleContractEventListener } from "./eventListeners/oracleContract/index.js";
import { tokenContractEventListener } from "./eventListeners/tokenContract/index.js";

export default async function web3EventListeners() {
  bettingContractEventListener();
  oracleContractEventListener();
  tokenContractEventListener();
}
