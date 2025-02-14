import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import * as evervault from '../../../services/evervault';
import { mpcClient } from '../../../services/mpc/constants';

jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    exportWalletAccount: jest.fn(),
  },
}));

describe('ExportWalletAccount', () => {
  const evervaultDecryptSpy = jest.spyOn(evervault, 'evervaultDecrypt');
  const mockExportWalletAccount = jest.mocked(mpcClient.exportWalletAccount);

  const mockEac = {
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
    evervaultDecryptSpy.mockResolvedValue(JSON.stringify(mockEac));
    mockExportWalletAccount.mockResolvedValue(undefined);
  });

  describe('POST /api/v1/actions/ExportWalletAccount', () => {
    it('should successfully export wallet account', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/ExportWalletAccount')
        .set('Accept', 'application/json')
        .send({
          exportId: mockExportId,
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockEac)],
        });
      expect(result.status).toBe(201);
      expect(result).toSatisfyApiSpec();
      expect(mockExportWalletAccount).toHaveBeenCalledTimes(1);
      expect(mockExportWalletAccount).toHaveBeenCalledWith({
        chain: mockEac.chain,
        exportId: mockExportId,
        roomId: mockRoomId,
        serverKeyShare: Number(mockEac.serverKeyShare),
      });
    });

    it('should handle multiple server EACs', async () => {
      const secondMockEac = {
        ...mockEac,
        userId: faker.string.uuid(),
      };

      const result = await testServer.app
        .post('/api/v1/actions/ExportWalletAccount')
        .set('Accept', 'application/json')
        .send({
          exportId: mockExportId,
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockEac), JSON.stringify(secondMockEac)],
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
        .send({
          exportId: mockExportId,
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockEac)],
        });

      expect(result.status).toBe(500);
      expect(result).toSatisfyApiSpec();
      expect(result.body.error_code).toBe('unknown_error');
    });

    it('should validate required fields', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/ExportWalletAccount')
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
