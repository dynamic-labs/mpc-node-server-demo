import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import type { EacType } from '../../../generated';
import * as evervault from '../../../services/evervault';
import * as jwtService from '../../../services/jwt';
import { mpcClient } from '../../../services/mpc/constants';

jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    refreshShares: jest.fn(),
  },
}));

jest.mock('../../../services/jwt');

describe('RefreshShares', () => {
  const evervaultDecryptSpy = jest.spyOn(evervault, 'evervaultDecrypt');
  const evervaultEncryptSpy = jest.spyOn(evervault, 'evervaultEncrypt');
  const mockRefreshShares = jest.mocked(mpcClient.refreshShares);

  const mockJwt = `${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}`;
  const mockServerEac: EacType = {
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
    evervaultDecryptSpy.mockResolvedValue(JSON.stringify(mockServerEac));
    evervaultEncryptSpy.mockImplementation(async (str) => `ev:${str}`);
    mockRefreshShares.mockResolvedValue({
      serverKeyShare: mockRefreshedKeyShare,
    });
    (jwtService.verifyJWT as jest.Mock).mockResolvedValue({
      isVerified: true,
      verifiedPayload: undefined,
    });
  });

  describe('POST /api/v1/actions/RefreshShares', () => {
    it('should successfully refresh shares', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/RefreshShares')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockServerEac)],
          jwt: mockJwt,
        });

      expect(result.status).toBe(200);
      expect(result).toSatisfyApiSpec();
      expect(mockRefreshShares).toHaveBeenCalledTimes(1);
      expect(mockRefreshShares).toHaveBeenCalledWith({
        chain: mockServerEac.chain,
        roomId: mockRoomId,
        serverKeyShare: 'old-key-share',
      });

      const expectedRefreshedEac = {
        ...mockServerEac,
        serverKeyShare: JSON.stringify(mockRefreshedKeyShare),
      };

      expect(result.body).toEqual({
        serverEacs: [`ev:${JSON.stringify(expectedRefreshedEac)}`],
      });
    });

    it('should handle multiple server EACs', async () => {
      const secondMockEac = {
        ...mockServerEac,
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
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          roomId: mockRoomId,
          serverEacs: [
            JSON.stringify(mockServerEac),
            JSON.stringify(secondMockEac),
          ],
          jwt: mockJwt,
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
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockServerEac)],
          jwt: mockJwt,
        });

      expect(result.status).toBe(500);
      expect(result).toSatisfyApiSpec();
      expect(result.body.error_code).toBe('unknown_error');
    });
  });
});
