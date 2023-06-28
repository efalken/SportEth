import express from "express";

import { PORT } from "./config.js";
import web3EventListeners from "./web3EventListeners/index.js";

const app = express();

web3EventListeners();
app.listen(PORT, () => console.log(`The server is listening on port ${PORT}`));
