import "./instrumentation.js";

import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";

import { config } from "./config.js";
import { logger } from "./logger.js";
import { router } from "./skills.js";

const app = express();
app.use(logger);
app.use(helmet());
app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.send("OK");
});

app.use("/skills", router);

app.listen(config.port, () => {
  logger.logger.info(`Server listening on port ${config.port}`);
});
