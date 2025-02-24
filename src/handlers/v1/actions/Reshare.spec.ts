import { ThresholdSignatureScheme } from '@dynamic-labs-wallet/server';
import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import type { EacType } from '../../../generated';
import * as evervault from '../../../services/evervault';
import * as jwtService from '../../../services/jwt';
import { mpcClient } from '../../../services/mpc/constants';

jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    reshareRemainingParty: jest.fn(),
    reshareNewParty: jest.fn(),
  },
}));

jest.mock('../../../services/jwt');

describe('Reshare', () => {
  const evervaultDecryptSpy = jest.spyOn(evervault, 'evervaultDecrypt');
  const evervaultEncryptSpy = jest.spyOn(evervault, 'evervaultEncrypt');
  const mockReshareRemainingParty = jest.mocked(
    mpcClient.reshareRemainingParty,
  );
  const mockReshareNewParty = jest.mocked(mpcClient.reshareNewParty);

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

  const mockNewEac = {
    ...mockServerEac,
    serverKeygenInitResult: JSON.stringify({ newKeyInit: 'data' }),
    serverKeyShare: undefined,
  };

  const mockRoomId = faker.string.uuid();
  const mockAllPartyKeygenIds = ['id1', 'id2', 'id3'];
  const mockRefreshedKeyShare = 'new-key-share';

  beforeEach(() => {
    jest.clearAllMocks();
    evervaultDecryptSpy.mockResolvedValue(JSON.stringify(mockServerEac));
    evervaultEncryptSpy.mockImplementation(async (str) => `ev:${str}`);
    mockReshareRemainingParty.mockResolvedValue({
      serverKeyShare: mockRefreshedKeyShare,
    });
    mockReshareNewParty.mockResolvedValue({
      serverKeyShare: 'new-party-key-share',
    });
    (jwtService.verifyJWT as jest.Mock).mockResolvedValue({
      isVerified: true,
      verifiedPayload: undefined,
    });
  });

  describe('POST /api/v1/actions/Reshare', () => {
    it('should successfully reshare for remaining and new parties', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/Reshare')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockServerEac)],
          newServerEacs: [mockNewEac],
          allPartyKeygenIds: mockAllPartyKeygenIds,
          oldThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_TWO,
          newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
          jwt: mockJwt,
        });

      expect(result.status).toBe(200);
      expect(result).toSatisfyApiSpec();
      expect(mockReshareRemainingParty).toHaveBeenCalledTimes(1);
      expect(mockReshareNewParty).toHaveBeenCalledTimes(1);

      expect(result.body.serverEacs).toHaveLength(2);
    });

    it('should handle multiple remaining parties', async () => {
      const secondMockEac = {
        ...mockServerEac,
        userId: faker.string.uuid(),
        serverKeyShare: JSON.stringify('second-old-key-share'),
      };

      const result = await testServer.app
        .post('/api/v1/actions/Reshare')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          roomId: mockRoomId,
          serverEacs: [
            JSON.stringify(mockServerEac),
            JSON.stringify(secondMockEac),
          ],
          newServerEacs: [mockNewEac],
          allPartyKeygenIds: mockAllPartyKeygenIds,
          oldThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_TWO,
          newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
          jwt: mockJwt,
        });

      expect(result.status).toBe(200);
      expect(result).toSatisfyApiSpec();
      expect(mockReshareRemainingParty).toHaveBeenCalledTimes(2);
      expect(mockReshareNewParty).toHaveBeenCalledTimes(1);
      expect(result.body.serverEacs).toHaveLength(3);
    });

    it('should handle reshare failure gracefully', async () => {
      mockReshareRemainingParty.mockRejectedValue(new Error('Reshare failed'));

      const result = await testServer.app
        .post('/api/v1/actions/Reshare')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockServerEac)],
          newServerEacs: [mockNewEac],
          allPartyKeygenIds: mockAllPartyKeygenIds,
          oldThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_TWO,
          newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
          jwt: mockJwt,
        });

      expect(result.status).toBe(500);
      expect(result).toSatisfyApiSpec();
      expect(result.body.error_code).toBe('unknown_error');
    });
  });
});
