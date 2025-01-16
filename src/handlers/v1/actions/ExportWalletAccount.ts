import { exportWalletAccount } from '@dynamic-labs/dynamic-wallet-server';
import { Request, Response } from 'express';
/**
 * /api/v1/actions/ExportWalletAccount
 */
export const ExportWalletAccount = async (req: Request, res: Response) => {
  const { exportId, roomId, eac } = req.body;
  const { chain, serverKeyShare } = eac;
  console.log('HITTING EXPORT WALLET ACCOUNT 2 ------', {
    chain,
    serverKeyShare,
  });
  const parsedServerKeyShare = JSON.parse(serverKeyShare);
  console.log('parsedServerKeyShare', parsedServerKeyShare);
  await exportWalletAccount({
    chain,
    roomId,
    serverKeyShare: parsedServerKeyShare,
    exportId,
  });

  return res.status(201).send();
};
