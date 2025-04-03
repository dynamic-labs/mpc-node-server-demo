import {
  ExternalServerKeySharesType,
  ImportPrivateKey200Type,
  ImportPrivateKey400Type,
  ImportPrivateKey403Type,
  ImportPrivateKeyRequestType,
} from "../../../generated";
import {
  ThresholdSignatureScheme,
  authenticatedEvmClient,
  authenticatedSvmClient,
} from "../../../services/mpc/constants";
import { TypedRequestHandler } from "../../../types/express";

/**
 * /api/v1/actions/CreateWalletAccount
 */

export const ImportPrivateKey: TypedRequestHandler<{
  request: {
    body: ImportPrivateKeyRequestType;
  };
  response: {
    body:
      | ImportPrivateKey200Type
      | ImportPrivateKey400Type
      | ImportPrivateKey403Type;
    statusCode: 200 | 400 | 403;
  };
}> = async (req, res) => {
  const { chainName, privateKey, thresholdSignatureScheme, password } =
    req.body;
  const authToken = req.authToken;
  const environmentId = req.params.environmentId;
  if (!authToken) {
    return res.status(403).json({
      error_code: "api_key_required",
      error_message: "API key is required",
    });
  }
  const onError = (error: Error) => {
    throw new Error(error.message);
  };
  if (chainName === "EVM") {
    const evmClient = await authenticatedEvmClient({
      authToken,
      environmentId,
    });
    const {
      accountAddress,
      rawPublicKey,
      publicKeyHex,
      externalServerKeyShares,
    } = await evmClient.importPrivateKey({
      privateKey,
      chainName,
      thresholdSignatureScheme:
        thresholdSignatureScheme as ThresholdSignatureScheme,
      password,
      onError,
    });
    return res.status(200).json({
      rawPublicKey: JSON.stringify(rawPublicKey),
      externalServerKeyShares: JSON.stringify(externalServerKeyShares),
      accountAddress,
      publicKeyHex,
    });
  } else if (chainName === "SVM") {
    const svmClient = await authenticatedSvmClient({
      authToken,
      environmentId,
    });
    const { accountAddress, rawPublicKey, externalServerKeyShares } =
      await svmClient.importPrivateKey({
        privateKey,
        chainName,
        thresholdSignatureScheme:
          thresholdSignatureScheme as ThresholdSignatureScheme,
        password,
        onError,
      });

    if (!rawPublicKey) {
      throw new Error("Raw public key is required");
    }
    return res.status(200).json({
      rawPublicKey: JSON.stringify(rawPublicKey),
      externalServerKeyShares: JSON.stringify(externalServerKeyShares),
      accountAddress,
    });
  } else {
    throw new Error("Unsupported chain");
  }
};
