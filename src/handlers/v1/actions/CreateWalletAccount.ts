import {
  CreateWalletAccount403Type,
  CreateWalletAccountRequestType,
} from "../../../generated";
import {
  CreateWalletAccount200Type,
  CreateWalletAccount400Type,
} from "../../../generated";
import {
  authenticatedEvmClient,
  authenticatedSvmClient,
  evmClient,
  svmClient,
  ThresholdSignatureScheme,
} from "../../../services/mpc/constants";
import { TypedRequestHandler } from "../../../types/express";

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
  const { chainName, thresholdSignatureScheme } = req.body;
  const authToken = req.authToken;
  if (!authToken) {
    return res.status(403).json({
      error_code: "api_key_required",
      error_message: "API key is required",
    });
  }
  if (chainName === "EVM") {
    await authenticatedEvmClient(authToken);
    const {
      accountAddress,
      rawPublicKey,
      publicKeyHex,
      externalServerKeyShares,
    } = await evmClient.createWalletAccount({
      thresholdSignatureScheme:
        thresholdSignatureScheme as ThresholdSignatureScheme,
    });
    console.log("evm wallet created", {
      accountAddress,
      rawPublicKey,
      publicKeyHex,
      externalServerKeyShares,
    });
    return res.status(200).json({
      rawPublicKey: JSON.stringify(rawPublicKey),
      externalServerKeyShares: JSON.stringify(externalServerKeyShares),
      accountAddress,
      publicKeyHex,
    });
  } else if (chainName === "SVM") {
    await authenticatedSvmClient(authToken);
    const { accountAddress, rawPublicKey, externalServerKeyShares } =
      await svmClient.createWalletAccount({
        thresholdSignatureScheme:
          thresholdSignatureScheme as ThresholdSignatureScheme,
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
