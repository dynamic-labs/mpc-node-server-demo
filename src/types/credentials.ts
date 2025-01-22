import { EcdsaPublicKey } from '@sodot/sodot-node-sdk';
import { ChainType } from '../generated';

export type InitialEAC = {
  userId: string;
  serverKeygenInitResult: string;
  environmentId: string;
  chain: ChainType;
};

// Encrypted Account Credential
export type EAC = InitialEAC & {
  compressedPublicKey?: string;
  uncompressedPublicKey: string;
  accountAddress?: `0x${string}` | string;
  serverKeyShare: string;
};
