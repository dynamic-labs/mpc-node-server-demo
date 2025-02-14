import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import * as evervault from '../../../services/evervault';
import { mpcClient } from '../../../services/mpc/constants';

jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    refreshShares: jest.fn(),
  },
}));

describe('RefreshShares', () => {
  const evervaultDecryptSpy = jest.spyOn(evervault, 'evervaultDecrypt');
  const evervaultEncryptSpy = jest.spyOn(evervault, 'evervaultEncrypt');
  const mockRefreshShares = jest.mocked(mpcClient.refreshShares);

  const mockEac = {
    userId: faker.string.uuid(),
    compressedPublicKey: '123',
    uncompressedPublicKey: '123',
    accountAddress: faker.finance.ethereumAddress(),
    environmentId: faker.string.uuid(),
    serverKeygenInitResult: '123',
    serverKeyShare: JSON.stringify('old-key-share'),
    chain: 'EVM',
    derivationPath: '123',
  };

  const mockRoomId = faker.string.uuid();
  const mockRefreshedKeyShare = 'new-key-share';

  beforeEach(() => {
    jest.clearAllMocks();
    evervaultDecryptSpy.mockResolvedValue(JSON.stringify(mockEac));
    evervaultEncryptSpy.mockImplementation(async (str) => `ev:${str}`);
    mockRefreshShares.mockResolvedValue({
      serverKeyShare: mockRefreshedKeyShare,
    });
  });

  describe('POST /api/v1/actions/RefreshShares', () => {
    it('should successfully refresh shares', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/RefreshShares')
        .set('Accept', 'application/json')
        .send({
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockEac)],
        });

      expect(result.status).toBe(200);
      expect(result).toSatisfyApiSpec();
      expect(mockRefreshShares).toHaveBeenCalledTimes(1);
      expect(mockRefreshShares).toHaveBeenCalledWith({
        chain: mockEac.chain,
        roomId: mockRoomId,
        serverKeyShare: 'old-key-share',
      });

      const expectedRefreshedEac = {
        ...mockEac,
        serverKeyShare: JSON.stringify(mockRefreshedKeyShare),
      };

      expect(result.body).toEqual({
        serverEacs: [`ev:${JSON.stringify(expectedRefreshedEac)}`],
      });
    });

    it('should handle multiple server EACs', async () => {
      const secondMockEac = {
        ...mockEac,
        userId: faker.string.uuid(),
        serverKeyShare: JSON.stringify('second-old-key-share'),
      };

      mockRefreshShares
        .mockResolvedValueOnce({
          serverKeyShare: mockRefreshedKeyShare,
        })
        .mockResolvedValueOnce({
          serverKeyShare: 'second-new-key-share',
        });

      const result = await testServer.app
        .post('/api/v1/actions/RefreshShares')
        .set('Accept', 'application/json')
        .send({
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockEac), JSON.stringify(secondMockEac)],
        });

      expect(result.status).toBe(200);
      expect(result).toSatisfyApiSpec();
      expect(mockRefreshShares).toHaveBeenCalledTimes(2);
      expect(result.body.serverEacs).toHaveLength(2);
    });

    it('should handle refresh failure gracefully', async () => {
      mockRefreshShares.mockRejectedValue(new Error('Refresh failed'));

      const result = await testServer.app
        .post('/api/v1/actions/RefreshShares')
        .set('Accept', 'application/json')
        .send({
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockEac)],
        });

      expect(result.status).toBe(500);
      expect(result).toSatisfyApiSpec();
      expect(result.body.error_code).toBe('unknown_error');
    });

    it('should validate required fields', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/RefreshShares')
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
