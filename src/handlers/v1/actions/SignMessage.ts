import { Request, Response } from 'express';
import { signMessage } from '../../../services/wallets';
import { EAC } from '../../../types/credentials';

/**
 * /api/v1/actions/SignMessage
 */
export const SignMessage = async (req: Request, res: Response) => {
  const { message, roomId, eac } = req.body;
  const { serverKeygenInitResult, chain } = eac as EAC;
  // Sign the message
  await signMessage({
    message,
    serverKeygenInitResult: serverKeygenInitResult as any,
    chain,
    roomId,
  });

  return res.status(201).json();
};
