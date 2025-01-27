import { exportWalletAccount } from '@dynamic-labs-wallet/server';
import { Request, Response } from 'express';
import { EAC } from 'types/credentials';

/**
 * /api/v1/actions/ExportWalletAccount
 */

const exportSingleServerPartyWalletAccount = async (
  exportId: string,
  roomId: string,
  serverEac: EAC,
) => {
  const { chain, serverKeyShare } = serverEac;
  const exportedKey = await exportWalletAccount({
    chain,
    roomId,
    serverKeyShare: JSON.parse(serverKeyShare),
    exportId,
  });
  return exportedKey;
};

export const ExportWalletAccount = async (req: Request, res: Response) => {
  const { exportId, roomId, serverEacs } = req.body;

  await Promise.all(
    serverEacs.map((serverEac: EAC) =>
      exportSingleServerPartyWalletAccount(exportId, roomId, serverEac),
    ),
  );

  return res.status(201).json();
};
