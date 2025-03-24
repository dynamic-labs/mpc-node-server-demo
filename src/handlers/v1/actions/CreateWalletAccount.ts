import { ThresholdSignatureScheme } from "@dynamic-labs-wallet/server";
import { CreateWalletAccountRequestType } from "../../../generated";
import {
  CreateWalletAccount200Type,
  CreateWalletAccount400Type,
} from "../../../generated";
import { evmClient } from "../../../services/mpc/constants";
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

  if (chainName === "EVM") {
    const {
      accountAddress,
      rawPublicKey,
      publicKeyHex,
      externalServerKeyGenResults,
    } = await evmClient.createWalletAccount({
      thresholdSignatureScheme:
        thresholdSignatureScheme as ThresholdSignatureScheme,
    });
    return res.status(200).json({
      rawPublicKey: JSON.stringify(rawPublicKey),
      externalServerKeyGenResults: JSON.stringify(externalServerKeyGenResults),
      accountAddress,
      publicKeyHex,
    });
  } else {
    throw new Error("Unsupported chain");
  }
};
