import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import type { EacType } from '../../../generated';
import * as evervault from '../../../services/evervault';
import * as jwtService from '../../../services/jwt';
import { mpcClient } from '../../../services/mpc/constants';

jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    exportWalletAccount: jest.fn(),
  },
}));

jest.mock('../../../services/jwt');

describe('ExportWalletAccount', () => {
  const evervaultDecryptSpy = jest.spyOn(evervault, 'evervaultDecrypt');
  const mockExportWalletAccount = jest.mocked(mpcClient.exportWalletAccount);

  const mockJwt = `${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}`;
  const mockServerEac: EacType = {
    userId: faker.string.uuid(),
    compressedPublicKey: '123',
    uncompressedPublicKey: '123',
    accountAddress: faker.finance.ethereumAddress(),
    environmentId: faker.string.uuid(),
    serverKeygenInitResult: '123',
    serverKeyShare: '123',
    chain: 'EVM',
    derivationPath: '123',
  };

  const mockExportId = faker.string.uuid();
  const mockRoomId = faker.string.uuid();

  beforeEach(() => {
    jest.clearAllMocks();
    evervaultDecryptSpy.mockResolvedValue(JSON.stringify(mockServerEac));
    mockExportWalletAccount.mockResolvedValue(undefined);
    (jwtService.verifyJWT as jest.Mock).mockResolvedValue({
      isVerified: true,
      verifiedPayload: undefined,
    });
  });

  describe('POST /api/v1/actions/ExportWalletAccount', () => {
    it('should successfully export wallet account', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/ExportWalletAccount')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          exportId: mockExportId,
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockServerEac)],
          jwt: mockJwt,
        });
      expect(result.status).toBe(201);
      expect(result).toSatisfyApiSpec();
      expect(mockExportWalletAccount).toHaveBeenCalledTimes(1);
      expect(mockExportWalletAccount).toHaveBeenCalledWith({
        chain: mockServerEac.chain,
        exportId: mockExportId,
        roomId: mockRoomId,
        serverKeyShare: Number(mockServerEac.serverKeyShare),
      });
    });

    it('should handle multiple server EACs', async () => {
      const secondMockEac = {
        ...mockServerEac,
        userId: faker.string.uuid(),
      };

      const result = await testServer.app
        .post('/api/v1/actions/ExportWalletAccount')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          exportId: mockExportId,
          roomId: mockRoomId,
          serverEacs: [
            JSON.stringify(mockServerEac),
            JSON.stringify(secondMockEac),
          ],
          jwt: mockJwt,
        });

      expect(result.status).toBe(201);
      expect(result).toSatisfyApiSpec();
      expect(mockExportWalletAccount).toHaveBeenCalledTimes(2);
    });

    it('should handle export failure gracefully', async () => {
      mockExportWalletAccount.mockRejectedValue(new Error('Export failed'));

      const result = await testServer.app
        .post('/api/v1/actions/ExportWalletAccount')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          exportId: mockExportId,
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockServerEac)],
          jwt: mockJwt,
        });

      expect(result.status).toBe(500);
      expect(result).toSatisfyApiSpec();
      expect(result.body.error_code).toBe('unknown_error');
    });

    it('should validate required fields', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/ExportWalletAccount')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          // Missing required fields
          jwt: mockJwt,
        });

      expect(result.status).toBe(400);
      expect(result.body.error_code).toBe('missing_eac');
      expect(result.body.error_message).toBe(
        'At least one EAC is required for this operation',
      );
    });
  });
});
