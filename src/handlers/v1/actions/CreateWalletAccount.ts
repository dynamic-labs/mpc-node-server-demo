import { DynamicWalletClient } from "@dynamic-labs-wallet/node";
import { CreateWalletAccountRequestType } from "../../../generated";
import {
  CreateWalletAccount200Type,
  CreateWalletAccount400Type,
} from "../../../generated";
import {
  authToken,
  environmentId,
  mpcClient,
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
    body: CreateWalletAccount200Type | CreateWalletAccount400Type;
    statusCode: 200 | 400;
  };
}> = async (req, res) => {
  const { chainName, thresholdSignatureScheme } = req.body;
  console.log("creating server wallet client");
  const { rawPublicKey, externalServerKeyGenResults } = await mpcClient.keyGen({
    chainName,
    thresholdSignatureScheme,
  });

  console.log(rawPublicKey);
  console.log(externalServerKeyGenResults);

  return res.status(200).json({
    rawPublicKey: JSON.stringify(rawPublicKey),
    externalServerKeyGenResults: JSON.stringify(externalServerKeyGenResults),
  });
};
