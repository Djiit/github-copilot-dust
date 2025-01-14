import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";

import { config } from "./config.js";

const sdk = new NodeSDK({
  metricReader: new PrometheusExporter({ port: config.metricsPort }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
