import { DynamicEvmWalletClient } from "@dynamic-labs-wallet/node-evm";
import { DynamicSvmWalletClient } from "@dynamic-labs-wallet/node-svm";

const BASE_API_URL = process.env.BASE_API_URL;
const MPC_RELAY_URL = process.env.MPC_RELAY_URL;

const ENVIRONMENT_ID = process.env.ENVIRONMENT_ID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

export const environmentId = () => {
  if (!ENVIRONMENT_ID) {
    throw new Error("ENVIRONMENT_ID must be set");
  }
  return ENVIRONMENT_ID;
};

export const authToken = () => {
  if (!AUTH_TOKEN) {
    throw new Error("AUTH_TOKEN must be set");
  }
  return AUTH_TOKEN;
};

export const evmClient = new DynamicEvmWalletClient({
  environmentId: environmentId(),
  authToken: authToken(),
  baseApiUrl: BASE_API_URL,
  baseMPCRelayApiUrl: MPC_RELAY_URL,
});

export const authenticatedEvmClient = async (authToken: string) => {
  await evmClient.authenticateApiToken(authToken);
};

export const svmClient = new DynamicSvmWalletClient({
  environmentId: environmentId(),
  authToken: authToken(),
  baseApiUrl: BASE_API_URL,
  baseMPCRelayApiUrl: MPC_RELAY_URL,
});

export const authenticatedSvmClient = async (authToken: string) => {
  await svmClient.authenticateApiToken(authToken);
};

export declare enum ThresholdSignatureScheme {
  TWO_OF_TWO = "TWO_OF_TWO",
  TWO_OF_THREE = "TWO_OF_THREE",
  THREE_OF_FIVE = "THREE_OF_FIVE",
}
