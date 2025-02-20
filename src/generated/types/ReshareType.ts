import { BadRequestType } from './BadRequestType';
import { ForbiddenType } from './ForbiddenType';
import { InternalServerErrorType } from './InternalServerErrorType';
import { ReshareRequestType } from './ReshareRequestType';
import type { ReshareResponseType } from './ReshareResponseType';

/**
 * @description Successfully reshares all the parties
 */
export type Reshare200Type = ReshareResponseType;
/**
 * @description Bad Request
 */
export type Reshare400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type Reshare403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type Reshare500Type = InternalServerErrorType;
export type ReshareMutationRequestType = ReshareRequestType;
/**
 * @description Successfully reshares all the parties
 */
export type ReshareMutationResponseType = ReshareResponseType;
export type ReshareTypeMutation = {
  Response: ReshareMutationResponseType;
  Request: ReshareMutationRequestType;
  Errors: Reshare400Type | Reshare403Type | Reshare500Type;
};
