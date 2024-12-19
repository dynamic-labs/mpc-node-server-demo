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
  compressedPublicKey?: Uint8Array<ArrayBufferLike>;
  uncompressedPublicKey: Uint8Array<ArrayBufferLike> | EcdsaPublicKey;
  accountAddress?: `0x${string}`;
};
