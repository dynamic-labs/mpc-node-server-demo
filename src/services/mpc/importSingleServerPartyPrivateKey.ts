import {
  ThresholdSignatureScheme,
  importPrivateKey,
} from '@dynamic-labs-wallet/server';
import { evervaultEncrypt } from 'services/evervault';
import { EAC } from '../../types/credentials';
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

  const {
    accountAddress,
    compressedPublicKey,
    uncompressedPublicKey,
    serverKeyShare,
    derivationPath,
  } = await importPrivateKey({
    chain,
    roomId,
    serverKeygenInitResult: JSON.parse(serverKeygenInitResult) as any,
    keygenIds: [...otherServerKeygenIds, ...clientKeygenIds],
    thresholdSignatureScheme: _thresholdSignatureScheme,
  });

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
