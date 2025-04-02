import express from 'express';
import { registerMiddleware } from './handlers/middleware/registerMiddleware';
import logger from './logger';

const app = express();

registerMiddleware(app);

const port = process.env.PORT || 8010; // Use Heroku's PORT or default to 8010

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(port, () => {
    logger.info('Express started on port 8010');
  });
  server.setTimeout(10000); // 10 seconds
}

export default app;
