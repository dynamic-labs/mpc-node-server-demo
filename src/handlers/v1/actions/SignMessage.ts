import { signMessage } from '@dynamic-labs-wallet/server';
import { Request, Response } from 'express';
import { EAC } from '../../../types/credentials';

/**
 * /api/v1/actions/SignMessage
 */

const signSingleServerPartyMessage = async (
  message: string,
  roomId: string,
  serverEac: EAC,
) => {
  const { serverKeyShare, chain } = serverEac as EAC;
  await signMessage({
    message,
    chain,
    roomId,
    serverKeyShare: JSON.parse(serverKeyShare),
  });
};

export const SignMessage = async (req: Request, res: Response) => {
  const { message, roomId, serverEacs } = req.body;

  await Promise.all(
    serverEacs.map((serverEac: EAC) =>
      signSingleServerPartyMessage(message, roomId, serverEac),
    ),
  );

  return res.status(201).json();
};
