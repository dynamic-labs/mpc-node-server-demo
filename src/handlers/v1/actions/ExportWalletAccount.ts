import {
  ExportWalletAccount201Type,
  ExportWalletAccount400Type,
  ExportWalletAccount403Type,
  ExportWalletAccount500Type,
  ExportWalletAccountRequestType,
} from '../../../generated';
import { exportSingleServerPartyWalletAccount } from '../../../services/mpc/exportSingleServerPartyWalletAccount';
import { EAC } from '../../../types/credentials';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/ExportWalletAccount
 */

export const ExportWalletAccount: TypedRequestHandler<{
  request: {
    body: ExportWalletAccountRequestType;
  };
  response: {
    body:
      | ExportWalletAccount201Type
      | ExportWalletAccount400Type
      | ExportWalletAccount403Type
      | ExportWalletAccount500Type;
    statusCode: 201 | 400 | 403 | 500;
  };
}> = async (req, res) => {
  const { exportId, roomId, serverEacs } = req.body;

  await Promise.all(
    serverEacs.map((serverEac) =>
      // @TODO: Fix this type error with serverEac
      exportSingleServerPartyWalletAccount(exportId, roomId, serverEac as EAC),
    ),
  );

  return res.status(201).json();
};
