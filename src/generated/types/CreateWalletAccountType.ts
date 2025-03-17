import { BadRequestType } from "./BadRequestType";
import { CreateWalletAccountRequestType } from "./CreateWalletAccountRequestType";
import type { CreateWalletAccountResponseType } from "./CreateWalletAccountResponseType";

/**
 * @description Successfully revoked session key
 */
export type CreateWalletAccount200Type = CreateWalletAccountResponseType;
/**
 * @description Bad Request
 */
export type CreateWalletAccount400Type = BadRequestType;
export type CreateWalletAccountQueryRequestType =
  CreateWalletAccountRequestType;
/**
 * @description Successfully revoked session key
 */
export type CreateWalletAccountQueryResponseType =
  CreateWalletAccountResponseType;
export type CreateWalletAccountTypeQuery = {
  Response: CreateWalletAccountQueryResponseType;
  Request: CreateWalletAccountQueryRequestType;
  Errors: CreateWalletAccount400Type;
};
