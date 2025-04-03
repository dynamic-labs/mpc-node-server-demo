import { DynamicEvmWalletClient } from "@dynamic-labs-wallet/node-evm";
import { DynamicSvmWalletClient } from "@dynamic-labs-wallet/node-svm";

const BASE_API_URL = process.env.BASE_API_URL;
const MPC_RELAY_URL = process.env.MPC_RELAY_URL;

export const authenticatedEvmClient = async ({
  authToken,
  environmentId,
  baseApiUrl,
  baseMPCRelayApiUrl,
}: {
  authToken: string;
  environmentId: string;
  baseApiUrl?: string;
  baseMPCRelayApiUrl?: string;
}) => {
  const client = new DynamicEvmWalletClient({
    environmentId,
    baseApiUrl: baseApiUrl || BASE_API_URL,
    authToken,
    baseMPCRelayApiUrl: baseMPCRelayApiUrl || MPC_RELAY_URL,
  });
  await client.authenticateApiToken(authToken);
  return client;
};

export const authenticatedSvmClient = async ({
  authToken,
  environmentId,
  baseApiUrl,
  baseMPCRelayApiUrl,
}: {
  authToken: string;
  environmentId: string;
  baseApiUrl?: string;
  baseMPCRelayApiUrl?: string;
}) => {
  const client = new DynamicSvmWalletClient({
    environmentId,
    baseApiUrl: baseApiUrl || BASE_API_URL,
    authToken,
    baseMPCRelayApiUrl: baseMPCRelayApiUrl || MPC_RELAY_URL,
  });
  await client.authenticateApiToken(authToken);
  return client;
};

export declare enum ThresholdSignatureScheme {
  TWO_OF_TWO = "TWO_OF_TWO",
  TWO_OF_THREE = "TWO_OF_THREE",
  THREE_OF_FIVE = "THREE_OF_FIVE",
}
