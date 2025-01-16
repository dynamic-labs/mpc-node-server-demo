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
  const { serverKeygenInitResult, chain } = eac as EAC;

  const parsedKeygenResult = JSON.parse(serverKeygenInitResult);
  const _result = {
    pubkey: parsedKeygenResult.pubkey as EcdsaPublicKey,
    secretShare: parsedKeygenResult.secretShare as string,
  };

  console.log('parsedKeygenResult', parsedKeygenResult);
  const keyshare = new EcdsaKeygenResult(
    parsedKeygenResult.pubkey as EcdsaPublicKey,
    parsedKeygenResult.secretShare as string,
  );

  console.log('keyshare', keyshare);

  const keygenResult = new Ed25519KeygenResult(
    parsedKeygenResult.pubkey as Uint8Array,
    parsedKeygenResult.secretShare as string,
  );

  console.log('keygenResult', keygenResult);

  // Sign the message
  await signMessage({
    message,
    serverKeygenInitResult: serverKeygenInitResult as any,
    chain,
    roomId,
  });

  return res.status(201).json();
};
