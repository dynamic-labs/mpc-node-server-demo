import path from 'path';
import type { Express, NextFunction, Request, Response } from 'express';
import { middleware as OpenApiValidator } from 'express-openapi-validator';
import 'dotenv/config';

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  if (req.path.includes('/HealthCheck')) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    const error = new Error('Authentication required');
    Object.assign(error, { status: 401 });
    return next(error);
  }
  req.authToken = token;

  next();
};

export const registerOperationHandlers = (app: Express) => {
  app.use('/api', (req, _res, next) => {
    console.log('api url', req.originalUrl);
    next();
  });

  // Add auth middleware before the OpenAPI validator
  app.use('/api', authMiddleware);

  app.use(
    '/api',
    OpenApiValidator({
      apiSpec: path.join(__dirname, '../../generated/openapi/api@v1.yaml'),
      validateRequests: {
        allowUnknownQueryParameters: false,
        coerceTypes: false,
        removeAdditional: 'failing',
      },
      validateResponses: true,
      operationHandlers: path.join(__dirname, '../../handlers/v1'),
    }),
  );
};
