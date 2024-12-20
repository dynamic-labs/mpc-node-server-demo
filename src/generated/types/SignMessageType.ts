import { BadRequestType } from './BadRequestType';
import { ForbiddenType } from './ForbiddenType';
import { InternalServerErrorType } from './InternalServerErrorType';
import { SignMessageRequestType } from './SignMessageRequestType';

/**
 * @description Signed message
 */
export type SignMessage201Type = any;
/**
 * @description Bad Request
 */
export type SignMessage400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type SignMessage403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type SignMessage500Type = InternalServerErrorType;
export type SignMessageMutationRequestType = SignMessageRequestType;
export type SignMessageMutationResponseType = any;
export type SignMessageTypeMutation = {
  Response: SignMessageMutationResponseType;
  Request: SignMessageMutationRequestType;
  Errors: SignMessage400Type | SignMessage403Type | SignMessage500Type;
};
