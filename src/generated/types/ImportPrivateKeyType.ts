import { BadRequestType } from './BadRequestType';
import { ForbiddenType } from './ForbiddenType';
import { ImportPrivateKeyRequestType } from './ImportPrivateKeyRequestType';
import type { ImportPrivateKeyResponseType } from './ImportPrivateKeyResponseType';
import { InternalServerErrorType } from './InternalServerErrorType';

/**
 * @description Successfully imported private key
 */
export type ImportPrivateKey200Type = ImportPrivateKeyResponseType;
/**
 * @description Bad Request
 */
export type ImportPrivateKey400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type ImportPrivateKey403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type ImportPrivateKey500Type = InternalServerErrorType;
export type ImportPrivateKeyMutationRequestType = ImportPrivateKeyRequestType;
/**
 * @description Successfully imported private key
 */
export type ImportPrivateKeyMutationResponseType = ImportPrivateKeyResponseType;
export type ImportPrivateKeyTypeMutation = {
  Response: ImportPrivateKeyMutationResponseType;
  Request: ImportPrivateKeyMutationRequestType;
  Errors:
    | ImportPrivateKey400Type
    | ImportPrivateKey403Type
    | ImportPrivateKey500Type;
};
