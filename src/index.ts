import './datadog/tracer';

import express from 'express';
import { registerMiddleware } from './handlers/middleware/registerMiddleware';
import logger, { setupDatadogTransport } from './logger';

setupDatadogTransport();
const app = express();

registerMiddleware(app);

if (process.env.NODE_ENV !== 'test') {
  app.listen(8008, () => {
    logger.info('Express started on port 8008');
  });
}

export default app;
