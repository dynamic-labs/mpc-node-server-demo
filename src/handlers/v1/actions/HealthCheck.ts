import { Request } from 'express';
import { HealthCheck200Type, HealthCheck400Type } from '../../../generated';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/HealthCheck
 */
export const HealthCheck: TypedRequestHandler<{
  request: Request;
  response: {
    body: HealthCheck200Type | HealthCheck400Type;
    statusCode: 200 | 400;
  };
}> = (_req, res) => {
  return res.status(200).json({ status: 'OK' });
};
