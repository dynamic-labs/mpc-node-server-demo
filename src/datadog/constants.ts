import { isPreproduction, isProduction } from '../services/constants';

export const DD_IS_LOCAL = process.env.DEPLOYED !== 'true';
export const DD_DEBUG = process.env.DD_DEBUG === 'true' || DD_IS_LOCAL;

export const DD_API_KEY = process.env.DD_API_KEY;
export const DD_ENV = isProduction()
  ? 'production'
  : isPreproduction()
    ? 'preproduction'
    : 'development';

export const DD_SOURCE = process.env.DD_SOURCE;

export const DD_SERVICE = process.env.DD_SERVICE;

console.log(`DD_DEBUG: ${DD_DEBUG}`);
console.log(`DD_IS_LOCAL: ${DD_IS_LOCAL}`);
console.log(`DD_ENV: ${DD_ENV}`);
