import { Request, Response } from 'express';

/**
 * /api/v1/actions/HealthCheck
 */
export const HealthCheck = (_req: Request, res: Response) => {
  return res.status(200).json({ status: 'OK' });
};
