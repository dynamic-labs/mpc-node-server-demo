import { signMessage } from '@dynamic-labs/dynamic-wallet-server';
import { Request, Response } from 'express';
import { EAC } from '../../../types/credentials';

/**
 * /api/v1/actions/SignMessage
 */
export const SignMessage = async (req: Request, res: Response) => {
  const { message, roomId, eac } = req.body;
  const { serverKeyShare, chain } = eac as EAC;

  await signMessage({
    message,
    chain,
    roomId,
    serverKeyShare: JSON.parse(serverKeyShare),
  });

  return res.status(201).json();
};
