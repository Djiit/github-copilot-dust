import { pinoHttp, type Options } from "pino-http";

const pinoOptions: Options = { level: process.env.LOG_LEVEL || "info" };

if (process.env.NODE_ENV !== "production") {
  pinoOptions.transport = {
    target: "pino-pretty",
  };
}

export const logger = pinoHttp(pinoOptions);
