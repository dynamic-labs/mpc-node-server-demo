import { BadRequestType } from "./BadRequestType";
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
export type CreateWalletAccountMutationRequestType = CreateWalletAccountRequestType;
/**
 * @description Successfully created wallet account
*/
export type CreateWalletAccountMutationResponseType = CreateWalletAccountResponseType;
export type CreateWalletAccountTypeMutation = {
    Response: CreateWalletAccountMutationResponseType;
    Request: CreateWalletAccountMutationRequestType;
    Errors: CreateWalletAccount400Type;
};