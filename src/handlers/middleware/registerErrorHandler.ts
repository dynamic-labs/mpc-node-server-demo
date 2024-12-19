import { Express } from 'express';
import { BadRequest } from 'express-openapi-validator/dist/openapi.validator';
import { ErrorWithStatus, StatusCode } from '../../Error';
import {
  BadRequestType,
  ForbiddenType,
  InternalServerErrorType,
} from '../../generated';
import { TypedErrorHandler, TypedRequest } from '../../types/express';

const errorHandler: TypedErrorHandler<{
  error: BadRequest | ErrorWithStatus;
  request: TypedRequest;
  response: {
    body: BadRequestType | ForbiddenType | InternalServerErrorType;
    statusCode: StatusCode;
  };
}> = (err, _req, res, _next) => {
  if (err instanceof BadRequest) {
    return res.status(400).send({
      error_code: 'bad_request',
      error_message: err.message,
    });
  }

  return res.status(err.status || 500).send({
    error_code: err.code || 'unknown_error',
    error_message: err.message || 'Unknown Error',
  });
};

export const registerErrorHandler = (app: Express) => {
  app.use(errorHandler);
};
