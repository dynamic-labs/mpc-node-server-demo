import express from 'express';
import { registerMiddleware } from './handlers/middleware/registerMiddleware';
import logger from './logger';

const app = express();

registerMiddleware(app);

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(8010, () => {
    logger.info('Express started on port 8010');
  });
  server.setTimeout(10000); // 10 seconds
}

export default app;
