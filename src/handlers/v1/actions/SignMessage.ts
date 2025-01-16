// import { signMessage } from '../../../services/wallets';
import { signMessage } from '@dynamic-labs/dynamic-wallet-server';
import {
  EcdsaKeygenResult,
  EcdsaPublicKey,
  Ed25519KeygenResult,
} from '@sodot/sodot-node-sdk';
import { Request, Response } from 'express';
import { EAC } from '../../../types/credentials';

/**
 * /api/v1/actions/SignMessage
 */
export const SignMessage = async (req: Request, res: Response) => {
  const { message, roomId, eac } = req.body;
  const { chain, serverKeyShare } = eac as EAC;

  const parsedServerKeyShare = JSON.parse(serverKeyShare);

  // Sign the message
  await signMessage({
    message,
    serverKeyShare: parsedServerKeyShare,
    chain,
    roomId,
  });

  return res.status(201).json();
};
