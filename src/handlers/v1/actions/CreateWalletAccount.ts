import { ThresholdSignatureScheme } from '@dynamic-labs-wallet/server';
import {
  CreateWalletAccount200Type,
  CreateWalletAccount400Type,
  CreateWalletAccount403Type,
  CreateWalletAccount500Type,
  CreateWalletAccountRequestType,
  PartialEacType,
} from '../../../generated';
import {
  WalletAccount,
  createSingleWalletAccount,
} from '../../../services/mpc/createSingleWalletAccount';
import { EAC } from '../../../types/credentials';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/CreateWalletAccount
 */
export const CreateWalletAccount: TypedRequestHandler<{
  request: {
    body: CreateWalletAccountRequestType;
  };
  response: {
    body:
      | CreateWalletAccount200Type
      | CreateWalletAccount400Type
      | CreateWalletAccount403Type
      | CreateWalletAccount500Type;
    statusCode: 200 | 400 | 403 | 500;
  };
}> = async (req, res, next) => {
  try {
    const { serverEacs, roomId, clientKeygenIds, thresholdSignatureScheme } =
      req.body;

    if (!serverEacs) {
      throw new Error('Server EACs are required');
    }

    //make promise await all
    const _serverKeyGenIds = await Promise.all(
      serverEacs.map(
        (eac: PartialEacType) =>
          JSON.parse(eac.serverKeygenInitResult).keygenId,
      ),
    );
    const walletAccounts = await Promise.all(
      serverEacs.map((eac: PartialEacType) =>
        createSingleWalletAccount(
          eac as EAC,
          roomId,
          clientKeygenIds,
          _serverKeyGenIds,
          thresholdSignatureScheme as ThresholdSignatureScheme,
        ),
      ),
    );

    return res.status(200).json({
      userId: walletAccounts[0].userId,
      environmentId: walletAccounts[0].environmentId,
      accountAddress: walletAccounts[0].accountAddress,
      uncompressedPublicKey: walletAccounts[0].uncompressedPublicKey,
      compressedPublicKey: walletAccounts[0].compressedPublicKey,
      derivationPath: walletAccounts[0].derivationPath,
      serverKeyShares: walletAccounts.map((walletAccount: WalletAccount) => {
        return {
          serverKeygenId: walletAccount.serverKeygenId,
          serverEac: walletAccount.modifiedEac,
        };
      }),
    });
  } catch (error) {
    next(error);
  }
};
