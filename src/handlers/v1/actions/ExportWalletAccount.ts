// import { exportWalletAccount } from '@dynamic-labs/dynamic-wallet-server';
import { Request, Response } from 'express';
import { exportWalletAccount } from '../../../services/wallets';
/**
 * /api/v1/actions/ExportWalletAccount
 */
export const ExportWalletAccount = async (req: Request, res: Response) => {
  const { exportId, roomId, eac } = req.body;
  console.log('HITTING EXPORT WALLET ACCOUNT ------', {
    exportId,
    roomId,
    eac,
  });
  const { chain, serverKeygenInitResult } = eac;
  console.log('HITTING EXPORT WALLET ACCOUNT 2 ------', {
    chain,
    serverKeygenInitResult,
  });
  await exportWalletAccount({
    chain,
    roomId,
    serverKeygenInitResult,
    exportId,
  });

  return res.status(201).send();
};
