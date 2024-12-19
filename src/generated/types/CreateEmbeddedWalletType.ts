import { BadRequestType } from './BadRequestType';
import { CreateEmbeddedWalletRequestType } from './CreateEmbeddedWalletRequestType';
import type { CreateEmbeddedWalletResponseType } from './CreateEmbeddedWalletResponseType';
import { ForbiddenType } from './ForbiddenType';
import { InternalServerErrorType } from './InternalServerErrorType';

/**
 * @description Successfully created embedded wallet
 */
export type CreateEmbeddedWallet200Type = CreateEmbeddedWalletResponseType;
/**
 * @description Bad Request
 */
export type CreateEmbeddedWallet400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type CreateEmbeddedWallet403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type CreateEmbeddedWallet500Type = InternalServerErrorType;
export type CreateEmbeddedWalletMutationRequestType =
  CreateEmbeddedWalletRequestType;
/**
 * @description Successfully created embedded wallet
 */
export type CreateEmbeddedWalletMutationResponseType =
  CreateEmbeddedWalletResponseType;
export type CreateEmbeddedWalletTypeMutation = {
  Response: CreateEmbeddedWalletMutationResponseType;
  Request: CreateEmbeddedWalletMutationRequestType;
  Errors:
    | CreateEmbeddedWallet400Type
    | CreateEmbeddedWallet403Type
    | CreateEmbeddedWallet500Type;
};
