export const DYNAMIC_PRODUCTION_HOSTNAME = 'app.dynamicauth.com';

export const getDynamicBaseApiUrl = (hostname: string) =>
  `https://${hostname}/api/v0`;

export const DATA_POLICY_ROLE =
  process.env.DATA_POLICY_ROLE || 'wallet-service-enclv';

export const EVERVAULT_HOST = 'http://127.0.0.1:9999';

export const DEVELOPMENT_EV_APP_UUID = 'app_4a23bc187835';

export const PREPRODUCTION_EV_APP_UUID = 'app_32d15525a875';

export const PRODUCTION_EV_APP_UUID = 'app_6e12fc400995';

export const ENVIRONMENT = process.env.ENVIRONMENT || 'local';

// EV_APP_UUID is provided by evervault
export const isDevelopment = (): boolean =>
  process.env.EV_APP_UUID === DEVELOPMENT_EV_APP_UUID;

export const isPreproduction = (): boolean =>
  process.env.EV_APP_UUID === PREPRODUCTION_EV_APP_UUID;

export const isProduction = (): boolean =>
  process.env.EV_APP_UUID === PRODUCTION_EV_APP_UUID;

export const isLocalDev = (): boolean => process.env.EV_APP_UUID === undefined;
