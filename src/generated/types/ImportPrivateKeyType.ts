import { BadRequestType } from "./BadRequestType";
import { ForbiddenType } from "./ForbiddenType";
import { ImportPrivateKeyRequestType } from "./ImportPrivateKeyRequestType";
import type { ImportPrivateKeyResponseType } from "./ImportPrivateKeyResponseType";

 export type ImportPrivateKeyPathParamsType = {
    /**
     * @description ID of the environment
     * @type string
    */
    environmentId: string;
};
/**
 * @description Successfully imported private key
*/
export type ImportPrivateKey200Type = ImportPrivateKeyResponseType;
/**
 * @description Bad Request
*/
export type ImportPrivateKey400Type = BadRequestType;
/**
 * @description Forbidden
*/
export type ImportPrivateKey403Type = ForbiddenType;
export type ImportPrivateKeyMutationRequestType = ImportPrivateKeyRequestType;
/**
 * @description Successfully imported private key
*/
export type ImportPrivateKeyMutationResponseType = ImportPrivateKeyResponseType;
export type ImportPrivateKeyTypeMutation = {
    Response: ImportPrivateKeyMutationResponseType;
    Request: ImportPrivateKeyMutationRequestType;
    PathParams: ImportPrivateKeyPathParamsType;
    Errors: ImportPrivateKey400Type | ImportPrivateKey403Type;
};