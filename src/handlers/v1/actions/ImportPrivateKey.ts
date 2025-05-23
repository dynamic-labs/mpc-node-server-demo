import {
  ImportPrivateKey200Type,
  ImportPrivateKey400Type,
  ImportPrivateKey403Type,
  ImportPrivateKeyRequestType,
} from "../../../generated";
import {
  evmClient,
  svmClient,
  ThresholdSignatureScheme,
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
  if (!authToken) {
    return res.status(403).json({
      error_code: "api_key_required",
      error_message: "API key is required",
    });
  }
  if (chainName === "EVM") {
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
    });
    return res.status(200).json({
      rawPublicKey: JSON.stringify(rawPublicKey),
      externalServerKeyShares: JSON.stringify(externalServerKeyShares),
      accountAddress,
      publicKeyHex,
    });
  } else if (chainName === "SVM") {
    const { accountAddress, rawPublicKey, externalServerKeyShares } =
      await svmClient.importPrivateKey({
        privateKey,
        chainName,
        thresholdSignatureScheme:
          thresholdSignatureScheme as ThresholdSignatureScheme,
        password,
      });
    return res.status(200).json({
      rawPublicKey: JSON.stringify(rawPublicKey),
      externalServerKeyShares: JSON.stringify(externalServerKeyShares),
      accountAddress,
    });
  } else {
    throw new Error("Unsupported chain");
  }
};
