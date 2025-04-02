import { BadRequestType } from "./BadRequestType";
import { ForbiddenType } from "./ForbiddenType";
import { InternalServerErrorType } from "./InternalServerErrorType";
import { GetWalletsRequestType } from "./GetWalletsRequestType";
import type { GetWalletsResponseType } from "./GetWalletsResponseType";

 export type GetWalletsPathParamsType = {
    /**
     * @description ID of the environment
     * @type string
    */
    environmentId: string;
};
/**
 * @description Successfully retrieved wallets
*/
export type GetWallets200Type = GetWalletsResponseType;
/**
 * @description Bad Request
*/
export type GetWallets400Type = BadRequestType;
/**
 * @description Forbidden
*/
export type GetWallets403Type = ForbiddenType;
/**
 * @description Internal Server Error
*/
export type GetWallets500Type = InternalServerErrorType;
export type GetWalletsQueryRequestType = GetWalletsRequestType;
/**
 * @description Successfully retrieved wallets
*/
export type GetWalletsQueryResponseType = GetWalletsResponseType;
export type GetWalletsTypeQuery = {
    Response: GetWalletsQueryResponseType;
    Request: GetWalletsQueryRequestType;
    PathParams: GetWalletsPathParamsType;
    Errors: GetWallets400Type | GetWallets403Type | GetWallets500Type;
};