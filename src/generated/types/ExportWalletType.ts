import { BadRequestType } from './BadRequestType';
import { ExportWalletRequestType } from './ExportWalletRequestType';
import type { ExportWalletResponseType } from './ExportWalletResponseType';
import { ForbiddenType } from './ForbiddenType';
import { InternalServerErrorType } from './InternalServerErrorType';

/**
 * @description Exported wallet
 */
export type ExportWallet200Type = ExportWalletResponseType;
/**
 * @description Bad Request
 */
export type ExportWallet400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type ExportWallet403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type ExportWallet500Type = InternalServerErrorType;
export type ExportWalletMutationRequestType = ExportWalletRequestType;
/**
 * @description Exported wallet
 */
export type ExportWalletMutationResponseType = ExportWalletResponseType;
export type ExportWalletTypeMutation = {
  Response: ExportWalletMutationResponseType;
  Request: ExportWalletMutationRequestType;
  Errors: ExportWallet400Type | ExportWallet403Type | ExportWallet500Type;
};
