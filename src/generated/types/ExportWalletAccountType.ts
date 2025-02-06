import { BadRequestType } from './BadRequestType';
import type { EmptyBodyType } from './EmptyBodyType';
import { ExportWalletAccountRequestType } from './ExportWalletAccountRequestType';
import { ForbiddenType } from './ForbiddenType';
import { InternalServerErrorType } from './InternalServerErrorType';

/**
 * @description Exported wallet account
 */
export type ExportWalletAccount201Type = EmptyBodyType;
/**
 * @description Bad Request
 */
export type ExportWalletAccount400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type ExportWalletAccount403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type ExportWalletAccount500Type = InternalServerErrorType;
export type ExportWalletAccountMutationRequestType =
  ExportWalletAccountRequestType;
/**
 * @description Exported wallet account
 */
export type ExportWalletAccountMutationResponseType = EmptyBodyType;
export type ExportWalletAccountTypeMutation = {
  Response: ExportWalletAccountMutationResponseType;
  Request: ExportWalletAccountMutationRequestType;
  Errors:
    | ExportWalletAccount400Type
    | ExportWalletAccount403Type
    | ExportWalletAccount500Type;
};
