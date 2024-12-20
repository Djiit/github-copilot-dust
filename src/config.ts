import "dotenv/config";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: ".env.local", override: true });

export const config = {
  env: process.env.NODE_ENV || "development",
  dust: {
    workspaceId: process.env.DUST_WORKSPACE_ID || "",
    apiKey: process.env.DUST_API_KEY || "",
  },
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || "info",
};
