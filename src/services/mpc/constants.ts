import { DynamicWalletServerClient } from '@dynamic-labs-wallet/server';

export const mpcClient = new DynamicWalletServerClient({
  relayApiKey: process.env.RELAY_API_KEY,
});

export const SERVER_KEY_SHARE_IS_MISSING_ERROR = 'Server key share is required';
