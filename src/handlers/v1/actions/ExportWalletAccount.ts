import { Request, Response } from 'express';
import { exportSingleServerPartyWalletAccount } from 'services/mpc/exportSingleServerPartyWalletAccount';
import { EAC } from 'types/credentials';

/**
 * /api/v1/actions/ExportWalletAccount
 */

export const ExportWalletAccount = async (req: Request, res: Response) => {
  const { exportId, roomId, serverEacs } = req.body;

  await Promise.all(
    serverEacs.map((serverEac: EAC) =>
      exportSingleServerPartyWalletAccount(exportId, roomId, serverEac),
    ),
  );

  return res.status(201).json();
};
