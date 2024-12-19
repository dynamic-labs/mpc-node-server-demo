import { transports } from 'winston';
import { DD_API_KEY, DD_SERVICE, DD_SOURCE } from '../datadog/constants';
import ddTracer from '../datadog/tracer';
import {
  isDevelopment,
  isPreproduction,
  isProduction,
} from '../services/constants';
import logger from './logger';

export const setupDatadogTransport = () => {
  if (!isProduction() && !isPreproduction() && !isDevelopment()) {
    console.log('Datadog transport not setup for local environments.');
    return;
  }

  const httpTransportOptions: transports.HttpTransportOptions = {
    host: 'http-intake.logs.datadoghq.com',
    path: `/api/v2/logs?dd-api-key=${DD_API_KEY}&ddsource=${DD_SOURCE}&service=${DD_SERVICE}&hostname=${DD_SERVICE}`,
    ssl: true,
    batch: true,
    batchCount: 10,
    batchInterval: 1000,
  };

  const httpTransport = new transports.Http(httpTransportOptions);

  /**
   * Wrapping the _doRequest method to add a custom tag to the span.
   * This adds tage drop:true to span so the tracer will not send it.
   */
  const wrappers = {
    _doRequest: ddTracer.wrap(
      'doRequest',
      { resource: 'dd-logger-doRequest', tags: { drop: 'true' } },
      // biome-ignore lint/suspicious/noExplicitAny: private method access
      (httpTransport as any)._doRequest,
    ),
  };
  Object.assign(httpTransport, wrappers);

  logger.add(httpTransport);
  console.log('Datadog transport setup');
};
