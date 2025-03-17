import express, { Express } from 'express';
import { registerErrorHandler } from './registerErrorHandler';
import { registerOperationHandlers } from './registerOperationHandlers';
export const registerMiddleware = (app: Express) => {
  app.use(express.json());
  registerErrorHandler(app);
  registerOperationHandlers(app);
};
