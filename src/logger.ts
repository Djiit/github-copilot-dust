import { pinoHttp, type Options } from "pino-http";

import { config } from "./config.js";

const pinoOptions: Options = { level: config.logLevel };

if (config.env !== "production") {
  pinoOptions.transport = {
    target: "pino-pretty",
  };
}

export const logger = pinoHttp(pinoOptions);
