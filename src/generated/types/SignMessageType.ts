import { BadRequestType } from './BadRequestType';
import { SignMessageRequestType } from './SignMessageRequestType';
import type { SignMessageResponseType } from './SignMessageResponseType';

/**
 * @description Successfully signed message
 */
export type SignMessage200Type = SignMessageResponseType;
/**
 * @description Bad Request
 */
export type SignMessage400Type = BadRequestType;
export type SignMessageMutationRequestType = SignMessageRequestType;
/**
 * @description Successfully signed message
 */
export type SignMessageMutationResponseType = SignMessageResponseType;
export type SignMessageTypeMutation = {
  Response: SignMessageMutationResponseType;
  Request: SignMessageMutationRequestType;
  Errors: SignMessage400Type;
};
