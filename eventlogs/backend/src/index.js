import express from "express";
import cors from "cors";

import { PORT } from "./config.js";
import eventRouter from "./routes/eventRouter.js";
import oracleEventRouter from "./routes/oracleEventRouter.js";
import web3EventListeners from "./web3EventListeners/index.js";

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

const app = express();

// add middlewares
app.use(express.json());
app.use(cors());

app.use("/events", eventRouter);
app.use("/events/oracle", oracleEventRouter);

console.log("A");

// start the server
app.listen(PORT, () => console.log(`The server is listening on port ${PORT}`));

// start the web3 event listeners
web3EventListeners();
