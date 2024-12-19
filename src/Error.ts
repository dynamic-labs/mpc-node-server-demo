import {
  BadRequestErrorCodeType,
  ForbiddenErrorCodeType,
  InternalServerErrorErrorCodeType,
} from './generated';

export type StatusCode = 400 | 403 | 422 | 500;
type ErrorCodeCond<T extends StatusCode> = T extends 500
  ? InternalServerErrorErrorCodeType
  : T extends 403
    ? ForbiddenErrorCodeType
    : T extends 400 | 422
      ? BadRequestErrorCodeType
      : never;

export class ErrorWithStatus<T1 extends StatusCode = StatusCode> extends Error {
  constructor(
    public status: T1,
    public code: ErrorCodeCond<T1>,
    message: string,
  ) {
    super(message);
  }
}

export const throwHttpError = <T1 extends StatusCode>(
  statusCode: T1,
  errorCode: ErrorCodeCond<T1>,
  message: string,
): never => {
  throw new ErrorWithStatus(statusCode, errorCode, message);
};
