/// <reference types="express-serve-static-core" />

import { Request } from "express";
import { Response } from "express";
import { BadRequest } from "express-openapi-validator/dist/openapi.validator";
import * as core from "express-serve-static-core";
import { ErrorWithStatus } from "../Error";

// Extend Express Request using module augmentation
declare module "express" {
  export interface Request {
    authToken?: string;
  }
}

type TypedRequestProperties = {
  params?: core.ParamsDictionary;
  query?: core.Query;
  // biome-ignore lint/suspicious/noExplicitAny: Base Type for body
  body?: Record<string, any>;
};

type TypedResponseProperties = {
  // biome-ignore lint/suspicious/noExplicitAny: Base Type for body
  body: Record<string, any>;
  statusCode?: number;
};

export interface TypedRequest<
  T extends TypedRequestProperties = {
    params: core.ParamsDictionary;
    query: core.Query;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    body: Record<string, any>;
  }
> extends Request<
    T["params"] extends core.ParamsDictionary
      ? T["params"]
      : core.ParamsDictionary,
    // biome-ignore lint/suspicious/noExplicitAny: Likely not
    any,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    T["body"] extends Record<string, any> ? T["body"] : unknown,
    T["query"] extends core.Query ? T["query"] : core.Query
  > {}
export interface TypedResponse<T extends TypedResponseProperties>
  extends Response<T["body"], Record<string, any>> {}

export type TypedRequestHandler<
  T extends {
    request: TypedRequestProperties;
    response: TypedResponseProperties;
  }
> = (
  req: TypedRequest<T["request"]>,
  res: TypedResponse<T["response"]>,
  next: core.NextFunction
) => // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
| (TypedResponse<T["response"]> | void)
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  | Promise<TypedResponse<T["response"]> | void>;

export type TypedErrorHandler<
  T extends {
    error: ErrorWithStatus | BadRequest;
    request: TypedRequestProperties;
    response: TypedResponseProperties;
  }
> = (
  error: T["error"],
  req: TypedRequest<T["request"]>,
  res: TypedResponse<T["response"]>,
  next: core.NextFunction
) => // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
| (TypedResponse<T["response"]> | void)
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  | Promise<TypedResponse<T["response"]> | void>;
