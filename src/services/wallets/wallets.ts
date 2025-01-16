import {
  Ecdsa,
  EcdsaInitKeygenResult,
  EcdsaKeygenResult,
  EcdsaPublicKey,
  Ed25519,
  Ed25519InitKeygenResult,
  Ed25519KeygenResult,
  MessageHash,
} from '@sodot/sodot-node-sdk';
import { publicKeyToAddress } from 'viem/accounts';
import { ChainType } from '../../generated/types';

import { buf2hex } from '../../utils/crypto';
import {
  CHAIN_CONFIG,
  NUMBER_OF_PARTIES,
  RELAY_API_KEY,
  RELAY_API_URL,
  SigningAlgorithm,
  THRESHOLD,
} from './constants';

export const getMPCSigner = (signingAlgorithm: SigningAlgorithm) => {
  switch (signingAlgorithm) {
    case SigningAlgorithm.ECDSA:
      return new Ecdsa(RELAY_API_URL);
    case SigningAlgorithm.ED25519:
      return new Ed25519(RELAY_API_URL);
    default:
      throw new Error(`Unsupported signing algorithm: ${signingAlgorithm}`);
  }
};

export const createMpcRoom = async ({
  chain,
  parties = NUMBER_OF_PARTIES,
}: {
  chain: ChainType;
  parties?: number;
}) => {
  const chainConfig = CHAIN_CONFIG[chain];
  const mpcSigner = getMPCSigner(chainConfig.signingAlgorithm);

  const roomId = await mpcSigner.createRoom(parties, RELAY_API_KEY);

  return {
    roomId,
  };
};

export const initKeygen = async ({ chain }: { chain: ChainType }) => {
  const chainConfig = CHAIN_CONFIG[chain];
  const mpcSigner = getMPCSigner(chainConfig.signingAlgorithm);
  const { roomId } = await createMpcRoom({ chain });
  const keygenInitResult = await mpcSigner.initKeygen();

  return {
    roomId,
    keygenInitResult,
  };
};

export const createWalletAccount = async ({
  chain,
  roomId,
  serverKeygenInitResult,
  clientKeygenId,
  clientBackupKeygenId,
  threshold = THRESHOLD,
}: {
  chain: ChainType;
  roomId: string;
  serverKeygenInitResult: Ed25519InitKeygenResult | EcdsaInitKeygenResult;
  clientKeygenId: string;
  clientBackupKeygenId: string;
  threshold?: number;
}) => {
  const chainConfig = CHAIN_CONFIG[chain];
  const mpcSigner = getMPCSigner(chainConfig.signingAlgorithm);

  // All parties join the keygen room
  const keygenIds = [clientKeygenId, clientBackupKeygenId];
  console.log('serverKeygenInitResult', serverKeygenInitResult);
  console.log('keygenIds', keygenIds);
  console.log('roomId', roomId);
  console.log('numberOfParties', NUMBER_OF_PARTIES);
  console.log('threshold', threshold);
  const keygenResult = await mpcSigner.keygen(
    roomId,
    NUMBER_OF_PARTIES,
    threshold,
    serverKeygenInitResult,
    keygenIds,
  );
  console.log('keygenResult', keygenResult);

  // Get the public key for the derivation path
  const publicKeyRaw = await mpcSigner.derivePubkey(
    keygenResult as any,
    new Uint32Array(chainConfig.derivationPath),
  );

  let accountAddress;
  let compressedPublicKey: Uint8Array | undefined;
  const uncompressedPublicKey: Uint8Array | EcdsaPublicKey = publicKeyRaw;
  if (publicKeyRaw instanceof EcdsaPublicKey) {
    const publicKeyCompressed = publicKeyRaw.serializeCompressed();
    compressedPublicKey = publicKeyCompressed;
    const publicKeyHex = buf2hex(publicKeyCompressed) as `0x${string}`;

    switch (chain) {
      case 'EVM':
        // Get EVM address from public key
        accountAddress = publicKeyToAddress(publicKeyHex);
        break;
      default:
        throw new Error(`Unsupported chain: ${chain}`);
    }
  }

  return {
    accountAddress,
    compressedPublicKey,
    uncompressedPublicKey,
  };
};

export const exportWalletAccount = async ({
  chain,
  roomId,
  serverKeyShare,
  exportId,
}: {
  chain: ChainType;
  roomId: string;
  serverKeyShare: any;
  exportId: string;
}) => {
  const chainConfig = CHAIN_CONFIG[chain];
  const mpcSigner = getMPCSigner(chainConfig.signingAlgorithm);

  // Export occurs only on the client that provided the exportId
  await mpcSigner.exportFullPrivateKey(roomId, serverKeyShare, exportId);
};

export const signMessage = async ({
  message,
  serverKeygenInitResult,
  chain,
  roomId,
}: {
  message: string;
  serverKeygenInitResult: Ed25519KeygenResult | EcdsaKeygenResult;
  chain: ChainType;
  roomId: string;
}) => {
  const chainConfig = CHAIN_CONFIG[chain];
  const mpcSigner = getMPCSigner(chainConfig.signingAlgorithm);

  let messageToSign: MessageHash | Uint8Array;
  if (mpcSigner instanceof Ecdsa) {
    // For ecdsa, signing requires a hashed message, while ed25519 requires the raw message
    messageToSign = MessageHash.sha256(message);
  } else {
    messageToSign = new TextEncoder().encode(message);
  }

  await mpcSigner.sign(
    roomId,
    serverKeygenInitResult as any,
    messageToSign as any,
    new Uint32Array(chainConfig.derivationPath),
  );
};
