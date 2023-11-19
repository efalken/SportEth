import { oracleContractEventListener } from "./eventListeners/oracleContract/index.js";

export default async function web3EventListeners() {
  await oracleContractEventListener();
}
