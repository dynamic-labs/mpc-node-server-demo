import {
  CreateWalletAccount403Type,
  CreateWalletAccountRequestType,
} from '../../../generated';
import {
  CreateWalletAccount200Type,
  CreateWalletAccount400Type,
} from '../../../generated';
import {
  ThresholdSignatureScheme,
  authenticatedEvmClient,
  authenticatedSvmClient,
} from '../../../services/mpc/constants';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/CreateWalletAccount
 */

export const CreateWalletAccount: TypedRequestHandler<{
  request: {
    body: CreateWalletAccountRequestType;
  };
  response: {
    body:
      | CreateWalletAccount200Type
      | CreateWalletAccount400Type
      | CreateWalletAccount403Type;
    statusCode: 200 | 400 | 403;
  };
}> = async (req, res) => {
  const { chainName, thresholdSignatureScheme, password } = req.body;
  const authToken = req.authToken;
  const environmentId = req.params.environmentId;
  if (!authToken) {
    return res.status(403).json({
      error_code: 'api_key_required',
      error_message: 'API key is required',
    });
  }
  const onError = (error: Error) => {
    throw new Error(error.message);
  };
  if (chainName === 'EVM') {
    const evmClient = await authenticatedEvmClient({
      authToken,
      environmentId,
    });
    const {
      accountAddress,
      rawPublicKey,
      publicKeyHex,
      externalServerKeyShares,
    } = await evmClient.createWalletAccount({
      thresholdSignatureScheme:
        thresholdSignatureScheme as ThresholdSignatureScheme,
      password,
      onError,
    });
    console.log('rawPublicKey', rawPublicKey);
    console.log('externalServerKeyShares', externalServerKeyShares);
    return res.status(200).json({
      rawPublicKey: JSON.stringify(rawPublicKey),
      externalServerKeyShares: JSON.stringify(externalServerKeyShares),
      accountAddress,
      publicKeyHex,
    });
  } else if (chainName === 'SVM') {
    const svmClient = await authenticatedSvmClient({
      authToken,
      environmentId,
    });
    const { accountAddress, rawPublicKey, externalServerKeyShares } =
      await svmClient.createWalletAccount({
        thresholdSignatureScheme:
          thresholdSignatureScheme as ThresholdSignatureScheme,
        password,
        onError,
      });
    return res.status(200).json({
      rawPublicKey: JSON.stringify(rawPublicKey),
      externalServerKeyShares: JSON.stringify(externalServerKeyShares),
      accountAddress,
    });
  } else {
    throw new Error('Unsupported chain');
  }
};
