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
    serverShare,
  } = await importPrivateKey({
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
    serverKeyShare: JSON.stringify(serverShare),
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
