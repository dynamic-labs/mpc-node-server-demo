import { BadRequestType } from './BadRequestType';
import { ForbiddenType } from './ForbiddenType';
import { InternalServerErrorType } from './InternalServerErrorType';
import { SignTransactionRequestType } from './SignTransactionRequestType';
import type { SignTransactionResponseType } from './SignTransactionResponseType';

export type SignTransactionPathParamsType = {
  /**
   * @description ID of the environment
   * @type string
   */
  environmentId: string;
};
/**
 * @description Successfully signed transaction
 */
export type SignTransaction200Type = SignTransactionResponseType;
/**
 * @description Bad Request
 */
export type SignTransaction400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type SignTransaction403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type SignTransaction500Type = InternalServerErrorType;
export type SignTransactionMutationRequestType = SignTransactionRequestType;
/**
 * @description Successfully signed transaction
 */
export type SignTransactionMutationResponseType = SignTransactionResponseType;
export type SignTransactionTypeMutation = {
  Response: SignTransactionMutationResponseType;
  Request: SignTransactionMutationRequestType;
  PathParams: SignTransactionPathParamsType;
  Errors:
    | SignTransaction400Type
    | SignTransaction403Type
    | SignTransaction500Type;
};
