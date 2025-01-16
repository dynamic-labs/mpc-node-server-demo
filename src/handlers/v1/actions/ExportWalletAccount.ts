import { exportWalletAccount } from '@dynamic-labs/dynamic-wallet-server';
import { Request, Response } from 'express';
/**
 * /api/v1/actions/ExportWalletAccount
 */
export const ExportWalletAccount = async (req: Request, res: Response) => {
  const { exportId, roomId, eac } = req.body;
  const { chain, serverKeyShare } = eac;

  await exportWalletAccount({
    chain,
    roomId,
    serverKeyShare: JSON.parse(serverKeyShare),
    exportId,
  });

  return res.status(201).send();
};
