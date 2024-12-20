import { Request, Response } from 'express';
import { exportWalletAccount } from '../../../services/wallets';
/**
 * /api/v1/actions/ExportWalletAccount
 */
export const ExportWalletAccount = async (req: Request, res: Response) => {
  const { exportId, roomId, eac } = req.body;
  const { chain, serverShare } = eac;

  await exportWalletAccount({
    chain,
    roomId,
    serverShare: JSON.parse(serverShare),
    exportId,
  });

  return res.status(201).send();
};
