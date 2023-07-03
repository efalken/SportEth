import express from "express";

import { PORT } from "./config.js";
import bettingEventRouter from "./routes/bettingEventRouter.js";
import tokenEventRouter from "./routes/tokenEventRouter.js";
import oracleEventRouter from "./routes/oracleEventRouter.js";
import web3EventListeners from "./web3EventListeners/index.js";

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

const app = express();

app.use("/events/betting", bettingEventRouter);
app.use("/events/oracle", oracleEventRouter);
app.use("/events/token", tokenEventRouter);

// start the server
app.listen(PORT, () => console.log(`The server is listening on port ${PORT}`));

// start the web3 event listeners
web3EventListeners();
