import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import * as evervault from '../../../services/evervault';
import * as jwtService from '../../../services/jwt';
import * as importSingleServerPartyPrivateKey from '../../../services/mpc/importSingleServerPartyPrivateKey';

jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    importPrivateKey: jest.fn(),
  },
}));

jest.mock('../../../services/jwt');

describe('ImportPrivateKey', () => {
  const evervaultDecryptSpy = jest.spyOn(evervault, 'evervaultDecrypt');
  const importSingleServerPartyPrivateKeySpy = jest.spyOn(
    importSingleServerPartyPrivateKey,
    'importSingleServerPartyPrivateKey',
  );

  const mockJwt = `${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}`;
  const mockServerEac = {
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
    userId: mockServerEac.userId,
    environmentId: mockServerEac.environmentId,
    accountAddress: mockServerEac.accountAddress,
    uncompressedPublicKey: mockServerEac.uncompressedPublicKey,
    compressedPublicKey: mockServerEac.compressedPublicKey,
    derivationPath: mockServerEac.derivationPath,
    serverKeygenId: faker.string.uuid(),
    modifiedEac: `ev:${JSON.stringify(mockServerEac)}`,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    evervaultDecryptSpy.mockResolvedValue(JSON.stringify(mockServerEac));
    importSingleServerPartyPrivateKeySpy.mockResolvedValue(mockWalletAccount);
    (jwtService.verifyJWT as jest.Mock).mockResolvedValue({
      isVerified: true,
      verifiedPayload: undefined,
    });
  });

  describe('POST /api/v1/actions/ImportPrivateKey', () => {
    it('should successfully import private key', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/ImportPrivateKey')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          roomId: mockRoomId,
          clientKeygenIds: mockClientKeygenIds,
          serverEacs: [JSON.stringify(mockServerEac)],
          thresholdSignatureScheme: 'TWO_OF_THREE',
          jwt: mockJwt,
        });

      expect(result.status).toBe(200);
      expect(result).toSatisfyApiSpec();
      expect(importSingleServerPartyPrivateKeySpy).toHaveBeenCalledTimes(1);
      expect(importSingleServerPartyPrivateKeySpy).toHaveBeenCalledWith({
        eac: expect.objectContaining(mockServerEac),
        roomId: mockRoomId,
        clientKeygenIds: mockClientKeygenIds,
        serverKeygenIds: [
          JSON.parse(mockServerEac.serverKeygenInitResult).keygenId,
        ],
        thresholdSignatureScheme: 'TWO_OF_THREE',
      });

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
        ...mockServerEac,
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
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          roomId: mockRoomId,
          clientKeygenIds: mockClientKeygenIds,
          serverEacs: [
            JSON.stringify(mockServerEac),
            JSON.stringify(secondMockEac),
          ],
          thresholdSignatureScheme: 'TWO_OF_THREE',
          jwt: mockJwt,
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
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          roomId: mockRoomId,
          clientKeygenIds: mockClientKeygenIds,
          serverEacs: [JSON.stringify(mockServerEac)],
          thresholdSignatureScheme: 'TWO_OF_THREE',
          jwt: mockJwt,
        });

      expect(result.status).toBe(500);
      expect(result).toSatisfyApiSpec();
      expect(result.body.error_code).toBe('unknown_error');
    });
  });
});
