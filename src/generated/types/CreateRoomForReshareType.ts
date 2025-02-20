import { BadRequestType } from './BadRequestType';
import { CreateRoomForReshareRequestType } from './CreateRoomForReshareRequestType';
import type { CreateRoomForReshareResponseType } from './CreateRoomForReshareResponseType';
import { ForbiddenType } from './ForbiddenType';
import { InternalServerErrorType } from './InternalServerErrorType';

/**
 * @description Successfully created room
 */
export type CreateRoomForReshare200Type = CreateRoomForReshareResponseType;
/**
 * @description Bad Request
 */
export type CreateRoomForReshare400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type CreateRoomForReshare403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type CreateRoomForReshare500Type = InternalServerErrorType;
export type CreateRoomForReshareMutationRequestType =
  CreateRoomForReshareRequestType;
/**
 * @description Successfully created room
 */
export type CreateRoomForReshareMutationResponseType =
  CreateRoomForReshareResponseType;
export type CreateRoomForReshareTypeMutation = {
  Response: CreateRoomForReshareMutationResponseType;
  Request: CreateRoomForReshareMutationRequestType;
  Errors:
    | CreateRoomForReshare400Type
    | CreateRoomForReshare403Type
    | CreateRoomForReshare500Type;
};
