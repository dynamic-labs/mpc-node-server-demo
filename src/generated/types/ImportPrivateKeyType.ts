import { BadRequestType } from './BadRequestType';
import { ImportPrivateKeyRequestType } from './ImportPrivateKeyRequestType';
import type { ImportPrivateKeyResponseType } from './ImportPrivateKeyResponseType';

/**
 * @description Successfully imported private key
 */
export type ImportPrivateKey200Type = ImportPrivateKeyResponseType;
/**
 * @description Bad Request
 */
export type ImportPrivateKey400Type = BadRequestType;
export type ImportPrivateKeyMutationRequestType = ImportPrivateKeyRequestType;
/**
 * @description Successfully imported private key
 */
export type ImportPrivateKeyMutationResponseType = ImportPrivateKeyResponseType;
export type ImportPrivateKeyTypeMutation = {
  Response: ImportPrivateKeyMutationResponseType;
  Request: ImportPrivateKeyMutationRequestType;
  Errors: ImportPrivateKey400Type;
};
