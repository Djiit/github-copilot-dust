import "dotenv/config";
import express from "express";
import dust from "@dust-tt/client";
import { config } from "dotenv";
import { pinoHttp, type Options } from "pino-http";
import helmet from "helmet";

config({ path: ".env.local", override: true });

const app = express();

const pinoOptions: Options = { level: process.env.LOG_LEVEL || "info" };

if (process.env.NODE_ENV !== "production") {
  pinoOptions.transport = {
    target: "pino-pretty",
  };
}

const pino = pinoHttp(pinoOptions);
app.use(pino);
app.use(helmet());

const dustClient = new dust.DustAPI(
  {
    url: "https://dust.tt",
    nodeEnv: "production",
  },
  {
    workspaceId: process.env.DUST_WORKSPACE_ID || "",
    apiKey: process.env.DUST_API_KEY || "",
    userEmail: process.env.DUST_USER_EMAIL || "",
  },
  console,
);

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/ping", (req, res) => {
  res.send("pong");
});

app.post("/dust", async (req, res) => {
  res.send("pong");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  pino.logger.info(`Server listening on port ${port}`);
});
