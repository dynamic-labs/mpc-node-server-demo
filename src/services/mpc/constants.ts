import { DynamicWalletServerClient } from '@dynamic-labs-wallet/server';

export const RELAY_API_KEY = process.env.RELAY_API_KEY;

export const mpcClient = new DynamicWalletServerClient({
  relayApiKey: RELAY_API_KEY,
});

export const SERVER_KEY_SHARE_IS_MISSING_ERROR = 'Server key share is required';
export const WALLET_ACCOUNT_CREATION_ERROR = 'Error creating wallet account';
