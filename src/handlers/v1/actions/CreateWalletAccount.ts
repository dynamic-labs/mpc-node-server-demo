// import { getMPCSigner } from '@dynamic-labs/dynamic-wallet-server';
import {
  ThresholdSignatureScheme,
  createWalletAccount,
} from '@dynamic-labs/dynamic-wallet-server';
import {
  CreateWalletAccount200Type,
  CreateWalletAccount400Type,
  CreateWalletAccount403Type,
  CreateWalletAccount500Type,
  CreateWalletAccountRequestType,
  PartialEacType,
} from '../../../generated';
import { evervaultEncrypt } from '../../../services/evervault';
import { EAC } from '../../../types/credentials';
import { TypedRequestHandler } from '../../../types/express';
/**
 * /api/v1/actions/CreateWalletAccount
 */

type WalletAccount = {
  userId: string;
  environmentId: string;
  modifiedEac: string;
  accountAddress: string;
  compressedPublicKey: string;
  uncompressedPublicKey: string;
  serverKeygenId: string;
};

const createSingleWalletAccount = async (
  eac: EAC,
  roomId: string,
  clientKeygenIds: string[],
  serverKeygenIds: string[],
  thresholdSignatureScheme: ThresholdSignatureScheme,
): Promise<WalletAccount> => {
  const { userId, serverKeygenInitResult, environmentId, chain } = eac;

  const otherServerKeygenIds = serverKeygenIds.filter(
    (id) => id !== JSON.parse(serverKeygenInitResult).keygenId,
  );

  const {
    accountAddress,
    compressedPublicKey,
    uncompressedPublicKey,
    serverKeyShare,
  } = await createWalletAccount({
    chain,
    roomId,
    serverKeygenInitResult: JSON.parse(serverKeygenInitResult) as any,
    keygenIds: [...otherServerKeygenIds, ...clientKeygenIds],
    thresholdSignatureScheme:
      thresholdSignatureScheme as ThresholdSignatureScheme,
  });

  // Encrypted Account Credential
  const rawEac: EAC = {
    userId,
    compressedPublicKey,
    uncompressedPublicKey,
    accountAddress,
    serverKeygenInitResult,
    serverKeyShare: JSON.stringify(serverKeyShare),
    environmentId,
    chain,
  };

  const modifiedEac = await evervaultEncrypt(JSON.stringify(rawEac));

  return {
    userId,
    environmentId,
    modifiedEac,
    accountAddress,
    compressedPublicKey,
    uncompressedPublicKey,
    serverKeygenId: JSON.parse(serverKeygenInitResult).keygenId,
  };
};

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
          thresholdSignatureScheme,
        ),
      ),
    );

    return res.status(200).json({
      userId: walletAccounts[0].userId,
      environmentId: walletAccounts[0].environmentId,
      accountAddress: walletAccounts[0].accountAddress,
      uncompressedPublicKey: walletAccounts[0].uncompressedPublicKey,
      compressedPublicKey: walletAccounts[0].compressedPublicKey,
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
