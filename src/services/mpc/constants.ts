import { DynamicWalletServerClient } from '@dynamic-labs-wallet/server';

export const mpcClient = new DynamicWalletServerClient({
  relayApiKey: process.env.RELAY_API_KEY,
});
