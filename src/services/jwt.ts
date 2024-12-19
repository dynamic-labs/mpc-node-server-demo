import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

import {
  DYNAMIC_PRODUCTION_HOSTNAME,
  isLocalDev,
  isPreproduction,
  isProduction,
} from './constants';

export const fetchDynamicEnvironmentPublicKey = async ({
  environmentId,
  baseUrl,
}: {
  environmentId: string;
  baseUrl: string;
}) => {
  const client = new JwksClient({
    jwksUri: `${baseUrl}/sdk/${environmentId}/.well-known/jwks`,
  });
  const signingKey = await client.getSigningKey();
  const publicKey = signingKey.getPublicKey();
  return publicKey;
};

export const verifyJWT = async ({
  environmentId,
  dynamicUserId,
  rawJwt,
}: {
  environmentId: string;
  dynamicUserId: string;
  rawJwt: string;
}) => {
  try {
    const decodedToken = jwt.decode(rawJwt) as JwtPayload;

    const jwtIssuer = decodedToken?.iss;

    // if the enclave is in production, the token must be verified from a dynamic prod hostname
    const jwtIssuerHostname = isProduction()
      ? DYNAMIC_PRODUCTION_HOSTNAME
      : jwtIssuer?.split('/').shift();
    const jwtIssuerEnvironmentId = jwtIssuer?.split('/')[1];
    const isDevToken =
      jwtIssuer?.includes('localhost') || jwtIssuer?.includes('127.0.0.1');
    const IS_PREPRODUCTION = isPreproduction();

    // if the token is a dev token and we are in preproduction or running locally, we can skip the JWT verification
    if ((IS_PREPRODUCTION || isLocalDev()) && isDevToken) {
      return { verifiedPayload: decodedToken, isVerified: true };
    }

    const publicKey = await fetchDynamicEnvironmentPublicKey({
      environmentId,
      baseUrl: `https://${jwtIssuerHostname}/api/v0`,
    });

    const verifiedJwtPayload = jwt.verify(rawJwt, publicKey, {
      subject: dynamicUserId,
    });

    // the decodedToken is verified at this point, we check non standard claims here
    if (jwtIssuerEnvironmentId !== environmentId) {
      throw new Error(
        'JWT issuer environment does not match the EDC environmentId',
      );
    }

    return { verifiedPayload: verifiedJwtPayload, isVerified: true };
  } catch (e) {
    console.error(e);
    return { verifiedPayload: undefined, isVerified: false };
  }
};
