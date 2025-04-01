import { BadRequestType } from "./BadRequestType";
import { ForbiddenType } from "./ForbiddenType";
import { InternalServerErrorType } from "./InternalServerErrorType";
import { CreateWalletAccountRequestType } from "./CreateWalletAccountRequestType";
import type { CreateWalletAccountResponseType } from "./CreateWalletAccountResponseType";

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
export type CreateWalletAccountMutationRequestType = CreateWalletAccountRequestType;
/**
 * @description Successfully created wallet account
*/
export type CreateWalletAccountMutationResponseType = CreateWalletAccountResponseType;
export type CreateWalletAccountTypeMutation = {
    Response: CreateWalletAccountMutationResponseType;
    Request: CreateWalletAccountMutationRequestType;
    Errors: CreateWalletAccount400Type | CreateWalletAccount403Type | CreateWalletAccount500Type;
};