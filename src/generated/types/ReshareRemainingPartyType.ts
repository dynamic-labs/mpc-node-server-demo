import { BadRequestType } from './BadRequestType';
import { ForbiddenType } from './ForbiddenType';
import { InternalServerErrorType } from './InternalServerErrorType';
import { ReshareRemainingPartyRequestType } from './ReshareRemainingPartyRequestType';
import type { ReshareRemainingPartyResponseType } from './ReshareRemainingPartyResponseType';

/**
 * @description Successfully reshares the remaining party
 */
export type ReshareRemainingParty200Type = ReshareRemainingPartyResponseType;
/**
 * @description Bad Request
 */
export type ReshareRemainingParty400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type ReshareRemainingParty403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type ReshareRemainingParty500Type = InternalServerErrorType;
export type ReshareRemainingPartyMutationRequestType =
  ReshareRemainingPartyRequestType;
/**
 * @description Successfully reshares the remaining party
 */
export type ReshareRemainingPartyMutationResponseType =
  ReshareRemainingPartyResponseType;
export type ReshareRemainingPartyTypeMutation = {
  Response: ReshareRemainingPartyMutationResponseType;
  Request: ReshareRemainingPartyMutationRequestType;
  Errors:
    | ReshareRemainingParty400Type
    | ReshareRemainingParty403Type
    | ReshareRemainingParty500Type;
};
