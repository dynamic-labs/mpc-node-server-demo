import { ThresholdSignatureScheme } from '@dynamic-labs-wallet/server';
import {
  ImportPrivateKey200Type,
  ImportPrivateKey400Type,
  ImportPrivateKeyRequestType,
} from '../../../generated';
import { evmClient } from '../../../services/mpc/constants';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/CreateWalletAccount
 */

export const ImportPrivateKey: TypedRequestHandler<{
  request: {
    body: ImportPrivateKeyRequestType;
  };
  response: {
    body: ImportPrivateKey200Type | ImportPrivateKey400Type;
    statusCode: 200 | 400;
  };
}> = async (req, res) => {
  const { chainName, privateKey, thresholdSignatureScheme, password } =
    req.body;
  console.log('creating server wallet client');
  if (chainName === 'EVM') {
    const { accountAddress, rawPublicKey, publicKeyHex, serverKeyShares } =
      await evmClient.importPrivateKey({
        privateKey,
        chainName,
        thresholdSignatureScheme:
          thresholdSignatureScheme as ThresholdSignatureScheme,
        password,
      });
    return res.status(200).json({
      rawPublicKey: JSON.stringify(rawPublicKey),
      serverKeyShares: JSON.stringify(serverKeyShares),
      accountAddress,
      publicKeyHex,
    });
  } else {
    throw new Error('Unsupported chain');
  }
};
