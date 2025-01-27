import {
    ThresholdSignatureScheme,
    createWalletAccount,
  } from '@dynamic-labs-wallet/server';
import { evervaultEncrypt } from 'services/evervault';
import { EAC } from '../../types/credentials';


export type WalletAccount = {
    userId: string;
    environmentId: string;
    modifiedEac: string;
    accountAddress: string;
    compressedPublicKey: string;
    uncompressedPublicKey: string;
    serverKeygenId: string;
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
