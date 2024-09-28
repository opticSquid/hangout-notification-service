'use strict';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
const {
  SEMRESATTRS_SERVICE_NAME,
} = require('@opentelemetry/semantic-conventions');
const traceExportPath = {
  url: 'http://localhost:4317',
};
const logExportPath = {
  url: 'http://localhost:9095/loki/api/v1/push',
};
const traceExporter = new OTLPTraceExporter(traceExportPath);
const logExporter = new OTLPLogExporter(logExportPath);
const observation = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'hangout-notification-service',
  }),
});
process.on('SIGTERM', () => {
  observation
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

export default observation;
