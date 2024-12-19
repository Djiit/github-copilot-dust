import "dotenv/config";
import express from "express";
import { config } from "dotenv";
import helmet from "helmet";

config({ path: ".env.local", override: true });

import { askDust } from "./dust.js";
import { logger } from "./logger.js";

const app = express();
app.use(logger);
app.use(helmet());

app.get("/health", (req, res) => {
  res.send("OK");
});

app.post("/ping", (req, res) => {
  res.send("pong");
});

app.post("/dust", async (req, res) => {
  const { assistant, message } = req.body;
  const answer = await askDust(message, assistant);
  res.send(answer);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.logger.info(`Server listening on port ${port}`);
});
