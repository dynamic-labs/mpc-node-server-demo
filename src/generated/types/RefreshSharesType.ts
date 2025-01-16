import { BadRequestType } from './BadRequestType';
import { ForbiddenType } from './ForbiddenType';
import { InternalServerErrorType } from './InternalServerErrorType';
import { RefreshSharesRequestType } from './RefreshSharesRequestType';
import type { RefreshSharesResponseType } from './RefreshSharesResponseType';

/**
 * @description Successfully refreshed shares
 */
export type RefreshShares200Type = RefreshSharesResponseType;
/**
 * @description Bad Request
 */
export type RefreshShares400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type RefreshShares403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type RefreshShares500Type = InternalServerErrorType;
export type RefreshSharesMutationRequestType = RefreshSharesRequestType;
/**
 * @description Successfully refreshed shares
 */
export type RefreshSharesMutationResponseType = RefreshSharesResponseType;
export type RefreshSharesTypeMutation = {
  Response: RefreshSharesMutationResponseType;
  Request: RefreshSharesMutationRequestType;
  Errors: RefreshShares400Type | RefreshShares403Type | RefreshShares500Type;
};
