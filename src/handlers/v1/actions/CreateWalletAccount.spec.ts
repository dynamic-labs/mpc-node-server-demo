import { EcdsaKeygenResult } from '@dynamic-labs-wallet/server';
import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import * as evervault from '../../../services/evervault';
import { mpcClient } from '../../../services/mpc/constants';
import * as createSingleWalletAccount from '../../../services/mpc/createSingleWalletAccount';

// Mock dependencies
jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    createWalletAccount: jest.fn(),
  },
}));

describe('CreateWalletAccount', () => {
  const createSingleWalletAccountSpy = jest.spyOn(
    createSingleWalletAccount,
    'createSingleWalletAccount',
  );
  const mockCreateWalletAccount = jest.mocked(mpcClient.createWalletAccount);
  const evervaultEncryptSpy = jest.spyOn(evervault, 'evervaultEncrypt');

  const mockEac = {
    userId: faker.string.uuid(),
    compressedPublicKey: '123',
    uncompressedPublicKey: '123',
    accountAddress: faker.finance.ethereumAddress(),
    environmentId: faker.string.uuid(),
    serverKeygenInitResult: JSON.stringify({ keygenId: faker.string.uuid() }),
    serverKeyShare: 'ev:123',
    chain: 'EVM',
    derivationPath: '123',
  };

  const mockWalletAccountResponse = {
    accountAddress: mockEac.accountAddress,
    compressedPublicKey: mockEac.compressedPublicKey,
    uncompressedPublicKey: mockEac.uncompressedPublicKey,
    serverKeyShare: {
      pubkey: mockEac.uncompressedPublicKey,
      secretShare: 'share123',
    } as unknown as EcdsaKeygenResult,
    derivationPath: new Uint32Array([44, 60, 0, 0, 0]),
  };

  const mockWalletAccount = {
    userId: mockEac.userId,
    environmentId: mockEac.environmentId,
    accountAddress: mockEac.accountAddress,
    uncompressedPublicKey: mockEac.uncompressedPublicKey,
    compressedPublicKey: mockEac.compressedPublicKey,
    derivationPath: JSON.stringify(mockWalletAccountResponse.derivationPath),
    serverKeygenId: JSON.parse(mockEac.serverKeygenInitResult).keygenId,
    modifiedEac: `ev:${JSON.stringify(mockEac)}`,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateWalletAccount.mockResolvedValue(mockWalletAccountResponse);
    evervaultEncryptSpy.mockResolvedValue(`ev:${JSON.stringify(mockEac)}`);
    createSingleWalletAccountSpy.mockResolvedValue(mockWalletAccount);
  });

  describe('POST /api/v1/actions/CreateWalletAccount', () => {
    it('should create a wallet account and return the account details', async () => {
      const roomId = faker.string.uuid();
      const clientKeygenIds = [faker.string.uuid()];

      const result = await testServer.app
        .post('/api/v1/actions/CreateWalletAccount')
        .set('Accept', 'application/json')
        .send({
          roomId,
          clientKeygenIds,
          thresholdSignatureScheme: 'TWO_OF_THREE',
          serverEacs: [JSON.stringify(mockEac)],
        });

      expect(result.status).toBe(200);
      expect(result).toSatisfyApiSpec();
      expect(result.body).toEqual({
        userId: mockWalletAccount.userId,
        environmentId: mockWalletAccount.environmentId,
        accountAddress: mockWalletAccount.accountAddress,
        uncompressedPublicKey: mockWalletAccount.uncompressedPublicKey,
        compressedPublicKey: mockWalletAccount.compressedPublicKey,
        derivationPath: mockWalletAccount.derivationPath,
        serverKeyShares: [
          {
            serverKeygenId: mockWalletAccount.serverKeygenId,
            serverEac: mockWalletAccount.modifiedEac,
          },
        ],
      });
      expect(createSingleWalletAccountSpy).toHaveBeenCalledTimes(1);
      expect(createSingleWalletAccountSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          eac: mockEac,
          roomId,
          clientKeygenIds,
          serverKeygenIds: [
            JSON.parse(mockEac.serverKeygenInitResult).keygenId,
          ],
          thresholdSignatureScheme: 'TWO_OF_THREE',
        }),
      );
    });

    it('should throw an error if the serverEacs are not provided', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/CreateWalletAccount')
        .set('Accept', 'application/json')
        .send({
          roomId: faker.string.uuid(),
          clientKeygenIds: [faker.string.uuid()],
          thresholdSignatureScheme: 'TWO_OF_THREE',
        });

      expect(result.status).toBe(400);
      expect(result).toSatisfyApiSpec();
      expect(result.body.error_code).toBe('bad_request');
      expect(result.body.error_message).toBe(
        "request/body must have required property 'serverEacs'",
      );
    });
  });
});
