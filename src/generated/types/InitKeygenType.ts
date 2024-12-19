import { BadRequestType } from './BadRequestType';
import { ForbiddenType } from './ForbiddenType';
import { InitKeygenRequestType } from './InitKeygenRequestType';
import type { InitKeygenResponseType } from './InitKeygenResponseType';
import { InternalServerErrorType } from './InternalServerErrorType';

/**
 * @description Successfully initialized keygen
 */
export type InitKeygen200Type = InitKeygenResponseType;
/**
 * @description Bad Request
 */
export type InitKeygen400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type InitKeygen403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type InitKeygen500Type = InternalServerErrorType;
export type InitKeygenMutationRequestType = InitKeygenRequestType;
/**
 * @description Successfully initialized keygen
 */
export type InitKeygenMutationResponseType = InitKeygenResponseType;
export type InitKeygenTypeMutation = {
  Response: InitKeygenMutationResponseType;
  Request: InitKeygenMutationRequestType;
  Errors: InitKeygen400Type | InitKeygen403Type | InitKeygen500Type;
};
