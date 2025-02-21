export const NUMBER_OF_PARTIES = process.env.NUMBER_OF_PARTIES
  ? parseInt(process.env.NUMBER_OF_PARTIES)
  : 3;
export const THRESHOLD = process.env.THRESHOLD
  ? parseInt(process.env.THRESHOLD)
  : 2;

export enum SigningAlgorithm {
  ECDSA = 'ECDSA',
  ED25519 = 'ED25519',
}

const BITCOIN_DERIVATION_PATHS = {
  LEGACY: [44, 0, 0, 0, 0],
  // m/49'/0'/0'/0/0  - SegWit (P2SH-P2WPKH)
  NATIVE_SEGWIT: [84, 0, 0, 0, 0],
  // m/44'/0'/0'/0/0  - Legacy (P2PKH)
  SEGWIT: [49, 0, 0, 0, 0], // m/84'/0'/0'/0/0  - Native SegWit (P2WPKH)
  TAPROOT: [86, 0, 0, 0, 0], // m/50'/0'/0'/0/0  - Taproot (P2TR)
};

export const CHAIN_CONFIG = {
  EVM: {
    // Uses secp256k1 ECDSA
    derivationPath: [44, 60, 0, 0, 0],
    signingAlgorithm: SigningAlgorithm.ECDSA, // ETH: 60
  },
  SOL: {
    // Uses Ed25519
    derivationPath: [44, 501, 0, 0, 0],
    signingAlgorithm: SigningAlgorithm.ED25519, // SOL: 501
  },
  BTC: {
    // Uses secp256k1 ECDSA
    derivationPath: BITCOIN_DERIVATION_PATHS.NATIVE_SEGWIT,
    signingAlgorithm: SigningAlgorithm.ECDSA, // BTC: 0
  },
  COSMOS: {
    // Uses Ed25519
    derivationPath: [44, 118, 0, 0, 0],
    signingAlgorithm: SigningAlgorithm.ED25519, // ATOM: 118
  },
  FLOW: {
    // Uses Ed25519
    derivationPath: [44, 539, 0, 0, 0],
    signingAlgorithm: SigningAlgorithm.ED25519, // FLOW: 539
  },
  SUI: {
    // Uses Ed25519
    derivationPath: [44, 784, 0, 0, 0],
    signingAlgorithm: SigningAlgorithm.ED25519, // SUI: 784
  },
};
