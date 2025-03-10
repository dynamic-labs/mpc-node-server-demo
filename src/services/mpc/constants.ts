import { DynamicWalletServerClient } from '@dynamic-labs-wallet/server';

const RELAY_API_KEY = process.env.RELAY_API_KEY;
const MPC_RELAY_URL = process.env.MPC_RELAY_URL;

export const mpcClient = new DynamicWalletServerClient({
  relayApiKey: RELAY_API_KEY,
  mpcRelayApiUrl: MPC_RELAY_URL,
});

export const SERVER_KEY_SHARE_IS_MISSING_ERROR = 'Server key share is required';
export const WALLET_ACCOUNT_CREATION_ERROR = 'Error creating wallet account';
