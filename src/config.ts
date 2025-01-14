import "dotenv/config";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: ".env.local", override: true });

export const config = {
  env: process.env.NODE_ENV || "development",
  disableRequestVerification: process.env.DISABLE_REQUEST_VERIFICATION || false,
  dust: {
    workspaceId: process.env.DUST_WORKSPACE_ID || "",
    apiKey: process.env.DUST_API_KEY || "",
  },
  port: parseInt(process.env.PORT || "3000"),
  metricsPort: parseInt(process.env.METRICS_PORT || "9464"),
  logLevel: process.env.LOG_LEVEL || "info",
};
