import { ThresholdSignatureScheme } from '@dynamic-labs-wallet/server';
import {
  EacType,
  PartialEacType,
  ThresholdSignatureSchemeType,
} from '../../generated';
import { evervaultEncrypt } from '../evervault';
import { WALLET_ACCOUNT_CREATION_ERROR, mpcClient } from './constants';
import { WalletAccount } from './createSingleWalletAccount';

export const importSingleServerPartyPrivateKey = async ({
  eac,
  roomId,
  clientKeygenIds,
  serverKeygenIds,
  thresholdSignatureScheme,
}: {
  eac: PartialEacType;
  roomId: string;
  clientKeygenIds: string[];
  serverKeygenIds: string[];
  thresholdSignatureScheme: ThresholdSignatureSchemeType;
}): Promise<WalletAccount> => {
  const { userId, serverKeygenInitResult, environmentId, chain } = eac;

  const otherServerKeygenIds = serverKeygenIds.filter(
    (id) => id !== JSON.parse(serverKeygenInitResult).keygenId,
  );

  type ImportPrivateKeyParams = Parameters<
    typeof mpcClient.importPrivateKey
  >[0];
  const importPrivateKeyParams: ImportPrivateKeyParams = {
    chain,
    roomId,
    serverKeygenInitResult: JSON.parse(serverKeygenInitResult),
    keygenIds: [...otherServerKeygenIds, ...clientKeygenIds],
    thresholdSignatureScheme:
      thresholdSignatureScheme as ThresholdSignatureScheme,
  };

  const {
    accountAddress,
    compressedPublicKey,
    uncompressedPublicKey,
    serverKeyShare,
    derivationPath,
  } = await mpcClient.importPrivateKey(importPrivateKeyParams);

  const serializedDerivationPath = JSON.stringify(derivationPath);

  // Encrypted Account Credential
  const rawEac: EacType = {
    userId,
    compressedPublicKey,
    uncompressedPublicKey,
    accountAddress,
    serverKeygenInitResult,
    serverKeyShare: JSON.stringify(serverKeyShare),
    environmentId,
    chain,
    derivationPath: serializedDerivationPath,
  };

  if (!compressedPublicKey || !uncompressedPublicKey || !accountAddress) {
    throw new Error(WALLET_ACCOUNT_CREATION_ERROR);
  }

  const modifiedEac = await evervaultEncrypt(JSON.stringify(rawEac));

  return {
    userId,
    environmentId,
    modifiedEac,
    accountAddress,
    compressedPublicKey,
    uncompressedPublicKey,
    derivationPath: serializedDerivationPath,
    serverKeygenId: JSON.parse(serverKeygenInitResult).keygenId,
  };
};
