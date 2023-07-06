import axios from "axios";
import { indexerEndpoint } from "../config";

export async function syncEvents(transactionHash) {
  await axios.post(`${indexerEndpoint}/events`, { transactionHash });
}
