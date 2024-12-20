import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import { config } from "./config.js";
import { askDust } from "./dust.js";
import { logger } from "./logger.js";

const app = express();
app.use(logger);
app.use(helmet());
app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.send("OK");
});

app.post("/ping", (req, res) => {
  res.send("pong");
});

app.post("/dust", async (req, res) => {
  const { message, assistant } = req.body;
  const answer = await askDust(message, assistant);
  res.send(answer);
});

app.listen(config.port, () => {
  logger.logger.info(`Server listening on port ${config.port}`);
});
