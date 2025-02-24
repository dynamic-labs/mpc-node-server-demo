import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import type { EacType } from '../../../generated';
import * as evervault from '../../../services/evervault';
import * as jwtService from '../../../services/jwt';
import { mpcClient } from '../../../services/mpc/constants';
import * as createSingleWalletAccount from '../../../services/mpc/createSingleWalletAccount';

// Mock dependencies
jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    createWalletAccount: jest.fn(),
  },
}));

jest.mock('../../../services/jwt');

describe('CreateWalletAccount', () => {
  const createSingleWalletAccountSpy = jest.spyOn(
    createSingleWalletAccount,
    'createSingleWalletAccount',
  );
  const mockCreateWalletAccount = jest.mocked(mpcClient.createWalletAccount);
  const evervaultEncryptSpy = jest.spyOn(evervault, 'evervaultEncrypt');

  const mockJwt = `${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}`;
  const mockServerEac: EacType = {
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
    accountAddress: mockServerEac.accountAddress,
    compressedPublicKey: mockServerEac.compressedPublicKey as string,
    uncompressedPublicKey: mockServerEac.uncompressedPublicKey,
    serverKeyShare: 'ev:123',
    derivationPath: new Uint32Array([44, 60, 0, 0, 0]),
  };

  const mockWalletAccount = {
    userId: mockServerEac.userId,
    environmentId: mockServerEac.environmentId,
    accountAddress: mockServerEac.accountAddress,
    uncompressedPublicKey: mockServerEac.uncompressedPublicKey,
    compressedPublicKey: mockServerEac.compressedPublicKey as string,
    derivationPath: JSON.stringify(mockWalletAccountResponse.derivationPath),
    serverKeygenId: mockServerEac.serverKeygenInitResult,
    modifiedEac: `ev:${JSON.stringify(mockServerEac)}`,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateWalletAccount.mockResolvedValue(mockWalletAccountResponse);
    evervaultEncryptSpy.mockResolvedValue(
      `ev:${JSON.stringify(mockServerEac)}`,
    );
    createSingleWalletAccountSpy.mockResolvedValue(mockWalletAccount);
    (jwtService.verifyJWT as jest.Mock).mockResolvedValue({
      isVerified: true,
      verifiedPayload: undefined,
    });
  });

  describe('POST /api/v1/actions/CreateWalletAccount', () => {
    it('should create a wallet account and return the account details', async () => {
      const roomId = faker.string.uuid();
      const clientKeygenIds = [faker.string.uuid()];

      const result = await testServer.app
        .post('/api/v1/actions/CreateWalletAccount')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          roomId,
          clientKeygenIds,
          thresholdSignatureScheme: 'TWO_OF_THREE',
          serverEacs: [JSON.stringify(mockServerEac)],
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
          eac: mockServerEac,
          roomId,
          clientKeygenIds,
          serverKeygenIds: [
            JSON.parse(mockServerEac.serverKeygenInitResult).keygenId,
          ],
          thresholdSignatureScheme: 'TWO_OF_THREE',
        }),
      );
    });

    it('should throw an error if the serverEacs are not provided', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/CreateWalletAccount')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          roomId: faker.string.uuid(),
          clientKeygenIds: [faker.string.uuid()],
          thresholdSignatureScheme: 'TWO_OF_THREE',
        });

      expect(result.status).toBe(400);
      expect(result.body.error_code).toBe('missing_eac');
      expect(result.body.error_message).toBe(
        'At least one EAC is required for this operation',
      );
    });
  });
});
