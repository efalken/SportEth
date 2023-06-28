import { bettingContractEventListener } from "./eventListeners/bettingContract";
import { oracleContractEventListener } from "./eventListeners/oracleContract";
import { tokenContractEventListener } from "./eventListeners/tokenContract";

export default async function web3EventListeners() {
  bettingContractEventListener();
  oracleContractEventListener();
  tokenContractEventListener();
}
