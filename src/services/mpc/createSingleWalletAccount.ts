import {
  ThresholdSignatureScheme,
  createWalletAccount,
} from '@dynamic-labs-wallet/server';
import { EAC } from '../../types/credentials';
import { evervaultEncrypt } from '../evervault';

export type WalletAccount = {
  userId: string;
  environmentId: string;
  modifiedEac: string;
  accountAddress: string;
  compressedPublicKey: string;
  uncompressedPublicKey: string;
  serverKeygenId: string;
  derivationPath: string;
};

export const createSingleWalletAccount = async (
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

  type CreateWalletAccountParams = Parameters<typeof createWalletAccount>[0];
  const createWalletAccountParams: CreateWalletAccountParams = {
    chain,
    roomId,
    serverKeygenInitResult: JSON.parse(serverKeygenInitResult),
    keygenIds: [...otherServerKeygenIds, ...clientKeygenIds],
    thresholdSignatureScheme,
  };

  const {
    accountAddress,
    compressedPublicKey,
    uncompressedPublicKey,
    serverKeyShare,
    derivationPath,
  } = await createWalletAccount(createWalletAccountParams);

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
