import { BadRequestType } from "./BadRequestType";
import { SignTransactionRequestType } from "./SignTransactionRequestType";
import type { SignTransactionResponseType } from "./SignTransactionResponseType";

 /**
 * @description Successfully signed transaction
*/
export type SignTransaction200Type = SignTransactionResponseType;
/**
 * @description Bad Request
*/
export type SignTransaction400Type = BadRequestType;
export type SignTransactionMutationRequestType = SignTransactionRequestType;
/**
 * @description Successfully signed transaction
*/
export type SignTransactionMutationResponseType = SignTransactionResponseType;
export type SignTransactionTypeMutation = {
    Response: SignTransactionMutationResponseType;
    Request: SignTransactionMutationRequestType;
    Errors: SignTransaction400Type;
};