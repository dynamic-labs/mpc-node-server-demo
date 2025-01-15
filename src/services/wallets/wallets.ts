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
import bs58 from 'bs58';
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

export const getKeygenId = async ({
  chainName,
  clientKeyshare,
}: {
  chainName: ChainType;
  clientKeyshare: EcdsaKeygenResult | Ed25519KeygenResult;
}) => {
  const chainConfig = CHAIN_CONFIG[chainName];
  const mpcSigner = getMPCSigner(chainConfig.signingAlgorithm);
  const exportId = await mpcSigner.exportID(clientKeyshare as any);
  return exportId;
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
  const { roomId } = await createMpcRoom({ chain, parties: 3 });
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
  clientPrimaryKeygenId,
  clientSecondaryKeygenId,
  threshold = THRESHOLD,
}: {
  chain: ChainType;
  roomId: string;
  serverKeygenInitResult: Ed25519InitKeygenResult | EcdsaInitKeygenResult;
  clientPrimaryKeygenId: string;
  clientSecondaryKeygenId: string;
  threshold?: number;
}) => {
  const chainConfig = CHAIN_CONFIG[chain];
  const mpcSigner = getMPCSigner(chainConfig.signingAlgorithm);

  // All parties join the keygen room
  const keygenIds = [clientPrimaryKeygenId, clientSecondaryKeygenId];
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
  let compressedPublicKey: string | undefined;
  let uncompressedPublicKey: string;
  if (publicKeyRaw instanceof EcdsaPublicKey) {
    const publicKeyCompressed = publicKeyRaw.serializeCompressed();
    const compressedPublicKeyHex = ('0x' +
      buf2hex(publicKeyCompressed)) as `0x${string}`;
    const publicKeyHex = ('0x' + publicKeyRaw.pubKeyAsHex()) as `0x${string}`;
    compressedPublicKey = compressedPublicKeyHex;
    uncompressedPublicKey = publicKeyHex;

    switch (chain) {
      case 'EVM':
        // Get EVM address from public key
        accountAddress = publicKeyToAddress(compressedPublicKeyHex);
        break;
      default:
        throw new Error(`Unsupported chain: ${chain}`);
    }
  } else {
    uncompressedPublicKey = '0x' + buf2hex(publicKeyRaw);
    accountAddress = bs58.encode(publicKeyRaw as Uint8Array);
  }

  return {
    accountAddress,
    compressedPublicKey,
    uncompressedPublicKey,
    serverShare: keygenResult,
  };
};

export const exportWalletAccount = async ({
  chain,
  roomId,
  serverShare,
  exportId,
}: {
  chain: ChainType;
  roomId: string;
  serverShare: Ed25519KeygenResult | EcdsaKeygenResult;
  exportId: string;
}) => {
  const chainConfig = CHAIN_CONFIG[chain];
  const mpcSigner = getMPCSigner(chainConfig.signingAlgorithm);

  // Export occurs only on the client that provided the exportId
  if (mpcSigner instanceof Ecdsa) {
    await mpcSigner.exportFullPrivateKey(
      roomId,
      serverShare as EcdsaKeygenResult,
      exportId,
    );
  } else {
    await mpcSigner.exportFullPrivateKey(
      roomId,
      serverShare as Ed25519KeygenResult,
      exportId,
    );
  }
};

export const signMessage = async ({
  message,
  serverShare,
  chain,
  roomId,
}: {
  message: string;
  serverShare: Ed25519KeygenResult | EcdsaKeygenResult;
  chain: ChainType;
  roomId: string;
}) => {
  const chainConfig = CHAIN_CONFIG[chain];
  const mpcSigner = getMPCSigner(chainConfig.signingAlgorithm);

  let messageToSign: MessageHash | Uint8Array<ArrayBufferLike>;
  if (mpcSigner instanceof Ecdsa) {
    // For ecdsa, signing requires a hashed message, while ed25519 requires the raw message
    messageToSign = MessageHash.sha256(message);

    console.log('messageToSign', messageToSign);
    console.log('serverShare', serverShare);
    console.log('roomId', roomId);
    console.log('chainConfig.derivationPath', chainConfig.derivationPath);
    await mpcSigner.sign(
      roomId,
      serverShare as EcdsaKeygenResult,
      messageToSign,
      new Uint32Array(chainConfig.derivationPath),
    );
  } else {
    messageToSign = new TextEncoder().encode(message);
    await mpcSigner.sign(
      roomId,
      serverShare as Ed25519KeygenResult,
      messageToSign,
      new Uint32Array(chainConfig.derivationPath),
    );
  }
};

export const refreshShares = async ({
  chain,
  roomId,
  serverShare,
}: {
  chain: ChainType;
  roomId: string;
  serverShare: Ed25519KeygenResult | EcdsaKeygenResult;
}) => {
  const chainConfig = CHAIN_CONFIG[chain];
  const mpcSigner = getMPCSigner(chainConfig.signingAlgorithm);

  let refreshResult;
  if (mpcSigner instanceof Ecdsa) {
    refreshResult = await mpcSigner.refresh(
      roomId,
      serverShare as EcdsaKeygenResult,
    );
  } else {
    refreshResult = await mpcSigner.refresh(
      roomId,
      serverShare as Ed25519KeygenResult,
    );
  }
  return {
    serverShare: refreshResult,
  };
};

export const reshareRemainingParty = async ({
  chain,
  roomId,
  serverShare,
  clientKeygenId,
  clientBackupKeygenId,
  newThreshold = THRESHOLD,
}: {
  chain: ChainType;
  roomId: string;
  clientKeygenId: string;
  clientBackupKeygenId: string;
  serverShare: Ed25519KeygenResult | EcdsaKeygenResult;
  newThreshold?: number;
}) => {
  const chainConfig = CHAIN_CONFIG[chain];
  const mpcSigner = getMPCSigner(chainConfig.signingAlgorithm);

  const keygenIds = [clientKeygenId, clientBackupKeygenId];
  let refreshResult;
  if (mpcSigner instanceof Ecdsa) {
    refreshResult = await mpcSigner.reshareRemainingParty(
      roomId,
      newThreshold,
      serverShare as EcdsaKeygenResult,
      keygenIds,
    );
  } else {
    refreshResult = await mpcSigner.reshareRemainingParty(
      roomId,
      newThreshold,
      serverShare as Ed25519KeygenResult,
      keygenIds,
    );
  }
  return {
    serverShare: refreshResult,
  };
};

export const importPrivateKey = async ({
  chain,
  roomId,
  serverKeygenInitResult,
  clientPrimaryKeygenId,
  clientSecondaryKeygenId,
  threshold = THRESHOLD,
}: {
  chain: ChainType;
  roomId: string;
  serverKeygenInitResult: Ed25519InitKeygenResult | EcdsaInitKeygenResult;
  clientPrimaryKeygenId: string;
  clientSecondaryKeygenId: string;
  threshold?: number;
}) => {
  const chainConfig = CHAIN_CONFIG[chain];
  const mpcSigner = getMPCSigner(chainConfig.signingAlgorithm);

  // All parties join the keygen room
  const keygenIds = [clientPrimaryKeygenId, clientSecondaryKeygenId];
  console.log('serverKeygenInitResult', serverKeygenInitResult);
  console.log('keygenIds', keygenIds);
  console.log('roomId', roomId);
  console.log('numberOfParties', NUMBER_OF_PARTIES);
  console.log('threshold', threshold);
  const keygenResult = await mpcSigner.importPrivateKeyRecipient(
    roomId,
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
  let compressedPublicKey: string | undefined;
  let uncompressedPublicKey: string;
  if (publicKeyRaw instanceof EcdsaPublicKey) {
    const publicKeyCompressed = publicKeyRaw.serializeCompressed();
    const compressedPublicKeyHex = ('0x' +
      buf2hex(publicKeyCompressed)) as `0x${string}`;
    const publicKeyHex = ('0x' + publicKeyRaw.pubKeyAsHex()) as `0x${string}`;
    compressedPublicKey = compressedPublicKeyHex;
    uncompressedPublicKey = publicKeyHex;

    switch (chain) {
      case 'EVM':
        // Get EVM address from public key
        accountAddress = publicKeyToAddress(compressedPublicKeyHex);
        break;
      default:
        throw new Error(`Unsupported chain: ${chain}`);
    }
  } else {
    uncompressedPublicKey = '0x' + buf2hex(publicKeyRaw);
    accountAddress = bs58.encode(publicKeyRaw as Uint8Array);
  }

  return {
    accountAddress,
    compressedPublicKey,
    uncompressedPublicKey,
    serverShare: keygenResult,
  };
};
