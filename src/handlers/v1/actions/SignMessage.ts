import {
  SignMessage200Type,
  SignMessage400Type,
  SignMessage403Type,
  SignMessageRequestType,
} from "../../../generated";
import {
  authenticatedEvmClient,
  authenticatedSvmClient,
} from "../../../services/mpc/constants";
import { TypedRequestHandler } from "../../../types/express";

/**
 * /api/v1/actions/SignMessage
 */

export const SignMessage: TypedRequestHandler<{
  request: {
    body: SignMessageRequestType;
  };
  response: {
    body: SignMessage200Type | SignMessage400Type | SignMessage403Type;
    statusCode: 200 | 400 | 403;
  };
}> = async (req, res) => {
  const { chainName, message, accountAddress, password } = req.body;
  console.log("signing message");
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
    const serializedSignature = await evmClient.signMessage({
      message,
      accountAddress,
      password,
    });
    return res.status(200).json({
      serializedSignature,
    });
  } else if (chainName === "SVM") {
    const svmClient = await authenticatedSvmClient({
      authToken,
      environmentId,
    });
    const serializedSignature = await svmClient.signMessage({
      message,
      accountAddress,
      password,
    });
    return res.status(200).json({
      serializedSignature,
    });
  } else {
    throw new Error("Unsupported chain");
  }
};
