import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import * as evervault from '../../../services/evervault';
import * as importSingleServerPartyPrivateKey from '../../../services/mpc/importSingleServerPartyPrivateKey';

jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    importPrivateKey: jest.fn(),
  },
}));
describe('ImportPrivateKey', () => {
  const evervaultDecryptSpy = jest.spyOn(evervault, 'evervaultDecrypt');
  const importSingleServerPartyPrivateKeySpy = jest.spyOn(
    importSingleServerPartyPrivateKey,
    'importSingleServerPartyPrivateKey',
  );

  const mockEac = {
    userId: faker.string.uuid(),
    compressedPublicKey: '123',
    uncompressedPublicKey: '123',
    accountAddress: faker.finance.ethereumAddress(),
    environmentId: faker.string.uuid(),
    serverKeygenInitResult: JSON.stringify({ keygenId: faker.string.uuid() }),
    serverKeyShare: '123',
    chain: 'EVM',
    derivationPath: '123',
  };

  const mockRoomId = faker.string.uuid();
  const mockClientKeygenIds = [faker.string.uuid()];
  const mockWalletAccount = {
    userId: mockEac.userId,
    environmentId: mockEac.environmentId,
    accountAddress: mockEac.accountAddress,
    uncompressedPublicKey: mockEac.uncompressedPublicKey,
    compressedPublicKey: mockEac.compressedPublicKey,
    derivationPath: mockEac.derivationPath,
    serverKeygenId: faker.string.uuid(),
    modifiedEac: `ev:${JSON.stringify(mockEac)}`,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    evervaultDecryptSpy.mockResolvedValue(JSON.stringify(mockEac));
    importSingleServerPartyPrivateKeySpy.mockResolvedValue(mockWalletAccount);
  });

  describe('POST /api/v1/actions/ImportPrivateKey', () => {
    it('should successfully import private key', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/ImportPrivateKey')
        .set('Accept', 'application/json')
        .send({
          roomId: mockRoomId,
          clientKeygenIds: mockClientKeygenIds,
          serverEacs: [JSON.stringify(mockEac)],
          thresholdSignatureScheme: 'TWO_OF_THREE',
        });

      expect(result.status).toBe(200);
      expect(result).toSatisfyApiSpec();
      expect(importSingleServerPartyPrivateKeySpy).toHaveBeenCalledTimes(1);
      expect(importSingleServerPartyPrivateKeySpy).toHaveBeenCalledWith(
        expect.objectContaining(mockEac),
        mockRoomId,
        mockClientKeygenIds,
        [JSON.parse(mockEac.serverKeygenInitResult).keygenId],
        'TWO_OF_THREE',
      );

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
    });

    it('should handle multiple server EACs', async () => {
      const secondMockEac = {
        ...mockEac,
        userId: faker.string.uuid(),
        serverKeygenInitResult: JSON.stringify({
          keygenId: faker.string.uuid(),
        }),
      };

      const secondMockWalletAccount = {
        ...mockWalletAccount,
        userId: secondMockEac.userId,
        serverKeygenId: faker.string.uuid(),
        modifiedEac: `ev:${JSON.stringify(secondMockEac)}`,
      };

      importSingleServerPartyPrivateKeySpy
        .mockResolvedValueOnce(mockWalletAccount)
        .mockResolvedValueOnce(secondMockWalletAccount);

      const result = await testServer.app
        .post('/api/v1/actions/ImportPrivateKey')
        .set('Accept', 'application/json')
        .send({
          roomId: mockRoomId,
          clientKeygenIds: mockClientKeygenIds,
          serverEacs: [JSON.stringify(mockEac), JSON.stringify(secondMockEac)],
          thresholdSignatureScheme: 'TWO_OF_THREE',
        });

      expect(result.status).toBe(200);
      expect(result).toSatisfyApiSpec();
      expect(importSingleServerPartyPrivateKeySpy).toHaveBeenCalledTimes(2);
      expect(result.body.serverKeyShares).toHaveLength(2);
    });

    it('should handle import failure gracefully', async () => {
      importSingleServerPartyPrivateKeySpy.mockRejectedValue(
        new Error('Import failed'),
      );

      const result = await testServer.app
        .post('/api/v1/actions/ImportPrivateKey')
        .set('Accept', 'application/json')
        .send({
          roomId: mockRoomId,
          clientKeygenIds: mockClientKeygenIds,
          serverEacs: [JSON.stringify(mockEac)],
          thresholdSignatureScheme: 'TWO_OF_THREE',
        });

      expect(result.status).toBe(500);
      expect(result).toSatisfyApiSpec();
      expect(result.body.error_code).toBe('unknown_error');
    });

    it('should validate required fields', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/ImportPrivateKey')
        .set('Accept', 'application/json')
        .send({
          // Missing required fields
        });

      expect(result.status).toBe(400);
      expect(result).toSatisfyApiSpec();
      expect(result.body.error_code).toBe('bad_request');
    });
  });
});
