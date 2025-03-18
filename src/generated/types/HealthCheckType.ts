import { BadRequestType } from "./BadRequestType";
import type { HealthCheckResponseType } from "./HealthCheckResponseType";

 /**
 * @description Successfully revoked session key
*/
export type HealthCheck200Type = HealthCheckResponseType;
/**
 * @description Bad Request
*/
export type HealthCheck400Type = BadRequestType;
/**
 * @description Successfully revoked session key
*/
export type HealthCheckQueryResponseType = HealthCheckResponseType;
export type HealthCheckTypeQuery = {
    Response: HealthCheckQueryResponseType;
    Errors: HealthCheck400Type;
};