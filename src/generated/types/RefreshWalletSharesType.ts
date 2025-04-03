import { BadRequestType } from "./BadRequestType";
import { ForbiddenType } from "./ForbiddenType";
import { InternalServerErrorType } from "./InternalServerErrorType";
import { RefreshWalletSharesRequestType } from "./RefreshWalletSharesRequestType";
import type { RefreshWalletSharesResponseType } from "./RefreshWalletSharesResponseType";

 export type RefreshWalletSharesPathParamsType = {
    /**
     * @description ID of the environment
     * @type string
    */
    environmentId: string;
};
/**
 * @description Successfully refreshed wallet shares
*/
export type RefreshWalletShares200Type = RefreshWalletSharesResponseType;
/**
 * @description Bad Request
*/
export type RefreshWalletShares400Type = BadRequestType;
/**
 * @description Forbidden
*/
export type RefreshWalletShares403Type = ForbiddenType;
/**
 * @description Internal Server Error
*/
export type RefreshWalletShares500Type = InternalServerErrorType;
export type RefreshWalletSharesMutationRequestType = RefreshWalletSharesRequestType;
/**
 * @description Successfully refreshed wallet shares
*/
export type RefreshWalletSharesMutationResponseType = RefreshWalletSharesResponseType;
export type RefreshWalletSharesTypeMutation = {
    Response: RefreshWalletSharesMutationResponseType;
    Request: RefreshWalletSharesMutationRequestType;
    PathParams: RefreshWalletSharesPathParamsType;
    Errors: RefreshWalletShares400Type | RefreshWalletShares403Type | RefreshWalletShares500Type;
};