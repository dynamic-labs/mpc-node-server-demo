import './datadog/tracer';

import express from 'express';
import { registerMiddleware } from './handlers/middleware/registerMiddleware';
import logger, { setupDatadogTransport } from './logger';

setupDatadogTransport();
const app = express();

registerMiddleware(app);

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(8008, () => {
    logger.info('Express started on port 8008');
  });
  server.setTimeout(10000); // 10 seconds
}

export default app;
