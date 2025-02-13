import { ThresholdSignatureScheme } from '@dynamic-labs-wallet/server';
import { EAC } from '../../types/credentials';
import { evervaultEncrypt } from '../evervault';
import { mpcClient } from './constants';
import { WalletAccount } from './createSingleWalletAccount';

export const importSingleServerPartyPrivateKey = async (
  eac: EAC,
  roomId: string,
  clientKeygenIds: string[],
  serverKeygenIds: string[],
  _thresholdSignatureScheme: ThresholdSignatureScheme,
): Promise<WalletAccount> => {
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
    thresholdSignatureScheme: _thresholdSignatureScheme,
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
  const rawEac: EAC = {
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

  const modifiedEac = await evervaultEncrypt(JSON.stringify(rawEac));

  if (!compressedPublicKey || !uncompressedPublicKey || !accountAddress) {
    throw new Error('Error creating wallet account');
  }

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
