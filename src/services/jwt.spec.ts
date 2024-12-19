import { describe, expect, it } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

import {
  DYNAMIC_PRODUCTION_HOSTNAME,
  PREPRODUCTION_EV_APP_UUID,
  PRODUCTION_EV_APP_UUID,
} from './constants';
import * as jwtService from './jwt';
import { fetchDynamicEnvironmentPublicKey, verifyJWT } from './jwt';

jest.mock('jwks-rsa');

describe('jwt', function () {
  const environmentId = 'test-env-id';

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  afterEach(() => {
    delete process.env.EV_APP_UUID;
  });

  describe('fetchDynamicEnvironmentPublicKey', function () {
    it('should fetch the public key', async () => {
      const mockGetSigningKey = jest.fn().mockResolvedValue({
        getPublicKey: jest.fn().mockReturnValue('mockPublicKey'),
      });

      (JwksClient as jest.Mock).mockImplementation(() => {
        return { getSigningKey: mockGetSigningKey };
      });

      const result = await fetchDynamicEnvironmentPublicKey({
        environmentId,
        baseUrl: 'some.base.url',
      });

      expect(JwksClient).toHaveBeenCalledWith({
        jwksUri: `some.base.url/sdk/${environmentId}/.well-known/jwks`,
      });
      expect(mockGetSigningKey).toHaveBeenCalled();
      expect(result).toBe('mockPublicKey');
    });
  });

  describe('verifyJWT', () => {
    let fetchDynamicEnvironmentPublicKeySpy: jest.SpyInstance;
    beforeEach(() => {
      fetchDynamicEnvironmentPublicKeySpy = jest
        .spyOn(jwtService, 'fetchDynamicEnvironmentPublicKey')
        .mockResolvedValue('mockPublicKey');
    });

    const localTokenMockPayload = {
      iss: `localhost:4200/${environmentId}`,
      verifiedUser: 'verifiedUser',
    };

    const preprodTokenMockPayload = {
      iss: `app.dynamic-preprod.xyz/${environmentId}`,
      verifiedUser: 'verifiedUser',
    };

    const prodTokenMockPayload = {
      iss: `app.dynamicauth.com/${environmentId}`,
      verifiedUser: 'verifiedUser',
    };

    it('should return the verified payload', async () => {
      jest.spyOn(jwt, 'decode').mockReturnValueOnce(prodTokenMockPayload);

      // @ts-ignore
      jest.spyOn(jwt, 'verify').mockReturnValueOnce(prodTokenMockPayload);

      const result = await verifyJWT({
        environmentId,
        dynamicUserId: 'test',
        rawJwt: 'rawJWT',
      });
      expect(result).toEqual({
        verifiedPayload: prodTokenMockPayload,
        isVerified: true,
      });
    });

    it('should skip validation for dev token in preprod', async () => {
      const jwtDecodeSpy = jest
        .spyOn(jwt, 'decode')
        .mockReturnValueOnce(localTokenMockPayload);

      // @ts-ignore
      const jwtVerifySpy = jest
        .spyOn(jwt, 'verify')
        // @ts-ignore
        .mockReturnValueOnce(localTokenMockPayload);

      process.env.EV_APP_UUID = PREPRODUCTION_EV_APP_UUID;
      const result = await verifyJWT({
        environmentId,
        dynamicUserId: 'test',
        rawJwt: 'rawJWT',
      });
      expect(jwtDecodeSpy).toHaveBeenCalled();
      expect(jwtVerifySpy).not.toHaveBeenCalled();
      expect(result).toEqual({
        verifiedPayload: localTokenMockPayload,
        isVerified: true,
      });
    });

    it('should validate for preprod issued token in preprod enclave', async () => {
      const jwtDecodeSpy = jest
        .spyOn(jwt, 'decode')
        .mockReturnValueOnce(preprodTokenMockPayload);

      // @ts-ignore
      const jwtVerifySpy = jest
        .spyOn(jwt, 'verify')
        // @ts-ignore
        .mockReturnValueOnce(preprodTokenMockPayload);

      process.env.EV_APP_UUID = PREPRODUCTION_EV_APP_UUID;
      const result = await verifyJWT({
        environmentId,
        dynamicUserId: 'test',
        rawJwt: 'rawJWT',
      });
      expect(jwtDecodeSpy).toHaveBeenCalled();
      expect(jwtVerifySpy).toHaveBeenCalled();
      expect(result).toEqual({
        verifiedPayload: preprodTokenMockPayload,
        isVerified: true,
      });
    });

    it('should use Dynamic production URL to fetch public key if production enclave', async () => {
      process.env.EV_APP_UUID = PRODUCTION_EV_APP_UUID;
      await verifyJWT({
        environmentId: 'differentEnvId',
        dynamicUserId: 'test',
        rawJwt: 'rawJWT',
      });
      expect(fetchDynamicEnvironmentPublicKeySpy).toHaveBeenCalledWith({
        environmentId: 'differentEnvId',
        baseUrl: `https://${DYNAMIC_PRODUCTION_HOSTNAME}/api/v0`,
      });
    });

    it('should fail verification if jwt issuer environment id does not match environment id in EDC', async () => {
      jest.spyOn(jwt, 'decode').mockReturnValueOnce(prodTokenMockPayload);

      jest.spyOn(jwt, 'verify').mockReturnValueOnce();

      const result = await verifyJWT({
        environmentId: 'differentEnvId',
        dynamicUserId: 'test',
        rawJwt: 'rawJWT',
      });
      expect(result).toEqual({
        verifiedPayload: undefined,
        isVerified: false,
      });
    });
  });
});
