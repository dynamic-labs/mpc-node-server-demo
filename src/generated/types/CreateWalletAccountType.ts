import { BadRequestType } from './BadRequestType';
import { CreateWalletAccountRequestType } from './CreateWalletAccountRequestType';
import type { CreateWalletAccountResponseType } from './CreateWalletAccountResponseType';
import { ForbiddenType } from './ForbiddenType';
import { InternalServerErrorType } from './InternalServerErrorType';

export type CreateWalletAccountPathParamsType = {
  /**
   * @description ID of the environment
   * @type string
   */
  environmentId: string;
};
/**
 * @description Successfully created wallet account
 */
export type CreateWalletAccount200Type = CreateWalletAccountResponseType;
/**
 * @description Bad Request
 */
export type CreateWalletAccount400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type CreateWalletAccount403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type CreateWalletAccount500Type = InternalServerErrorType;
export type CreateWalletAccountMutationRequestType =
  CreateWalletAccountRequestType;
/**
 * @description Successfully created wallet account
 */
export type CreateWalletAccountMutationResponseType =
  CreateWalletAccountResponseType;
export type CreateWalletAccountTypeMutation = {
  Response: CreateWalletAccountMutationResponseType;
  Request: CreateWalletAccountMutationRequestType;
  PathParams: CreateWalletAccountPathParamsType;
  Errors:
    | CreateWalletAccount400Type
    | CreateWalletAccount403Type
    | CreateWalletAccount500Type;
};
