import { signMessage } from '@dynamic-labs-wallet/server';
import { Request, Response } from 'express';
import { EAC } from '../../../types/credentials';
import { signSingleServerPartyMessage } from 'services/mpc/signSingleServerPartyMessage';

/**
 * /api/v1/actions/SignMessage
 */


export const SignMessage = async (req: Request, res: Response) => {
  const { message, roomId, serverEacs } = req.body;

  await Promise.all(
    serverEacs.map((serverEac: EAC) =>
      signSingleServerPartyMessage(message, roomId, serverEac),
    ),
  );

  return res.status(201).json();
};
