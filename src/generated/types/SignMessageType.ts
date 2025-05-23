import { BadRequestType } from "./BadRequestType";
import { ForbiddenType } from "./ForbiddenType";
import { InternalServerErrorType } from "./InternalServerErrorType";
import { SignMessageRequestType } from "./SignMessageRequestType";
import type { SignMessageResponseType } from "./SignMessageResponseType";

 /**
 * @description Successfully signed message
*/
export type SignMessage200Type = SignMessageResponseType;
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
/**
 * @description Successfully signed message
*/
export type SignMessageMutationResponseType = SignMessageResponseType;
export type SignMessageTypeMutation = {
    Response: SignMessageMutationResponseType;
    Request: SignMessageMutationRequestType;
    Errors: SignMessage400Type | SignMessage403Type | SignMessage500Type;
};