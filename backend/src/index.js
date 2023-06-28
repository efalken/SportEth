import express from "express";
import { PORT } from "./config";
import web3EventListeners from "./web3EventListeners";

const app = express();

web3EventListeners();
app.listen(PORT, () => console.log(`The server is listening on port ${PORT}`));
