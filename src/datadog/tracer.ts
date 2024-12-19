import tracer, { TracerOptions } from 'dd-trace';
import logger from '../logger';
import { DD_ENV, DD_SERVICE } from './constants';

const defaultTracerProps: TracerOptions = {
  experimental: {
    exporter: 'agent',
    traceparent: true,
  },
  logInjection: true,
  startupLogs: true,
  logger: logger,
  env: DD_ENV,
  service: DD_SERVICE,
};

const ddTracer = tracer.init(defaultTracerProps); // initialized in a different file to avoid hoisting.

tracer.use('dns');

export default ddTracer;
