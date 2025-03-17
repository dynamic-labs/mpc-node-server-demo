import path from 'path';
import type { Express } from 'express';
import { middleware as OpenApiValidator } from 'express-openapi-validator';
import 'dotenv/config';

export const registerOperationHandlers = (app: Express) => {
  app.use('/api', (req, _res, next) => {
    console.log('api url', req.originalUrl);
    next();
  });

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
