import { setup } from 'jest-dev-server';

export default async function globalSetup() {
  globalThis.servers = await setup({
    command: `ev-enclave dev`,
    launchTimeout: 5000,
    port: 9999,
  });
  process.env.RELAY_API_KEY = '123456';
}
