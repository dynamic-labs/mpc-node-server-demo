import {
  ExportPrivateKey200Type,
  ExportPrivateKey400Type,
  ExportPrivateKey403Type,
  ExportPrivateKeyRequestType,
} from "../../../generated";
import {
  authenticatedEvmClient,
  authenticatedSvmClient,
} from "../../../services/mpc/constants";
import { TypedRequestHandler } from "../../../types/express";

/**
 * /api/v1/actions/ExportPrivateKey
 */

export const ExportPrivateKey: TypedRequestHandler<{
  request: {
    body: ExportPrivateKeyRequestType;
  };
  response: {
    body:
      | ExportPrivateKey200Type
      | ExportPrivateKey400Type
      | ExportPrivateKey403Type;
    statusCode: 200 | 400 | 403;
  };
}> = async (req, res) => {
  const { chainName, accountAddress, password } = req.body;
  const authToken = req.authToken;
  const environmentId = req.params.environmentId;
  if (!authToken) {
    return res.status(403).json({
      error_code: "api_key_required",
      error_message: "API key is required",
    });
  }
  if (chainName === "EVM") {
    const evmClient = await authenticatedEvmClient({
      authToken,
      environmentId,
    });
    const { derivedPrivateKey } = await evmClient.exportPrivateKey({
      accountAddress,
      password,
    });
    if (!derivedPrivateKey) {
      throw new Error("Derived private key not found");
    }
    return res.status(200).json({
      derivedPrivateKey,
    });
  } else if (chainName === "SVM") {
    const svmClient = await authenticatedSvmClient({
      authToken,
      environmentId,
    });
    const { derivedPrivateKey } = await svmClient.exportPrivateKey({
      accountAddress,
      password,
    });
    if (!derivedPrivateKey) {
      throw new Error("Derived private key not found");
    }
    return res.status(200).json({
      derivedPrivateKey,
    });
  } else {
    throw new Error("Unsupported chain");
  }
};
