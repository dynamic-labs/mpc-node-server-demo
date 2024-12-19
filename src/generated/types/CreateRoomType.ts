import { BadRequestType } from './BadRequestType';
import { CreateRoomRequestType } from './CreateRoomRequestType';
import type { CreateRoomResponseType } from './CreateRoomResponseType';
import { ForbiddenType } from './ForbiddenType';
import { InternalServerErrorType } from './InternalServerErrorType';

/**
 * @description Successfully created room
 */
export type CreateRoom200Type = CreateRoomResponseType;
/**
 * @description Bad Request
 */
export type CreateRoom400Type = BadRequestType;
/**
 * @description Forbidden
 */
export type CreateRoom403Type = ForbiddenType;
/**
 * @description Internal Server Error
 */
export type CreateRoom500Type = InternalServerErrorType;
export type CreateRoomMutationRequestType = CreateRoomRequestType;
/**
 * @description Successfully created room
 */
export type CreateRoomMutationResponseType = CreateRoomResponseType;
export type CreateRoomTypeMutation = {
  Response: CreateRoomMutationResponseType;
  Request: CreateRoomMutationRequestType;
  Errors: CreateRoom400Type | CreateRoom403Type | CreateRoom500Type;
};
