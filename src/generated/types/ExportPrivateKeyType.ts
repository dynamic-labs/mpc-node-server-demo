import { BadRequestType } from "./BadRequestType";
import { ForbiddenType } from "./ForbiddenType";
import { InternalServerErrorType } from "./InternalServerErrorType";
import { ExportPrivateKeyRequestType } from "./ExportPrivateKeyRequestType";
import type { ExportPrivateKeyResponseType } from "./ExportPrivateKeyResponseType";

 export type ExportPrivateKeyPathParamsType = {
    /**
     * @description ID of the environment
     * @type string
    */
    environmentId: string;
};
/**
 * @description Successfully exported private key
*/
export type ExportPrivateKey200Type = ExportPrivateKeyResponseType;
/**
 * @description Bad Request
*/
export type ExportPrivateKey400Type = BadRequestType;
/**
 * @description Forbidden
*/
export type ExportPrivateKey403Type = ForbiddenType;
/**
 * @description Internal Server Error
*/
export type ExportPrivateKey500Type = InternalServerErrorType;
export type ExportPrivateKeyMutationRequestType = ExportPrivateKeyRequestType;
/**
 * @description Successfully exported private key
*/
export type ExportPrivateKeyMutationResponseType = ExportPrivateKeyResponseType;
export type ExportPrivateKeyTypeMutation = {
    Response: ExportPrivateKeyMutationResponseType;
    Request: ExportPrivateKeyMutationRequestType;
    PathParams: ExportPrivateKeyPathParamsType;
    Errors: ExportPrivateKey400Type | ExportPrivateKey403Type | ExportPrivateKey500Type;
};