import { ThresholdSignatureScheme } from '@dynamic-labs-wallet/server';
import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import * as evervault from '../../../services/evervault';
import { mpcClient } from '../../../services/mpc/constants';

jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    reshareRemainingParty: jest.fn(),
    reshareNewParty: jest.fn(),
  },
}));

describe('Reshare', () => {
  const evervaultDecryptSpy = jest.spyOn(evervault, 'evervaultDecrypt');
  const evervaultEncryptSpy = jest.spyOn(evervault, 'evervaultEncrypt');
  const mockReshareRemainingParty = jest.mocked(
    mpcClient.reshareRemainingParty,
  );
  const mockReshareNewParty = jest.mocked(mpcClient.reshareNewParty);

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

  const mockNewEac = {
    ...mockEac,
    serverKeygenInitResult: JSON.stringify({ newKeyInit: 'data' }),
    serverKeyShare: undefined,
  };

  const mockRoomId = faker.string.uuid();
  const mockAllPartyKeygenIds = ['id1', 'id2', 'id3'];
  const mockRefreshedKeyShare = 'new-key-share';

  beforeEach(() => {
    jest.clearAllMocks();
    evervaultDecryptSpy.mockResolvedValue(JSON.stringify(mockEac));
    evervaultEncryptSpy.mockImplementation(async (str) => `ev:${str}`);
    mockReshareRemainingParty.mockResolvedValue({
      serverKeyShare: mockRefreshedKeyShare,
    });
    mockReshareNewParty.mockResolvedValue({
      serverKeyShare: 'new-party-key-share',
    });
  });

  describe('POST /api/v1/actions/Reshare', () => {
    it('should successfully reshare for remaining and new parties', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/Reshare')
        .set('Accept', 'application/json')
        .send({
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockEac)],
          newServerEacs: [mockNewEac],
          allPartyKeygenIds: mockAllPartyKeygenIds,
          oldThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_TWO,
          newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
        });

      expect(result.status).toBe(200);
      expect(result).toSatisfyApiSpec();
      expect(mockReshareRemainingParty).toHaveBeenCalledTimes(1);
      expect(mockReshareNewParty).toHaveBeenCalledTimes(1);

      expect(result.body.serverEacs).toHaveLength(2);
    });

    it('should handle multiple remaining parties', async () => {
      const secondMockEac = {
        ...mockEac,
        userId: faker.string.uuid(),
        serverKeyShare: JSON.stringify('second-old-key-share'),
      };

      const result = await testServer.app
        .post('/api/v1/actions/Reshare')
        .set('Accept', 'application/json')
        .send({
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockEac), JSON.stringify(secondMockEac)],
          newServerEacs: [mockNewEac],
          allPartyKeygenIds: mockAllPartyKeygenIds,
          oldThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_TWO,
          newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
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
        .send({
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockEac)],
          newServerEacs: [mockNewEac],
          allPartyKeygenIds: mockAllPartyKeygenIds,
          oldThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_TWO,
          newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
        });

      expect(result.status).toBe(500);
      expect(result).toSatisfyApiSpec();
      expect(result.body.error_code).toBe('unknown_error');
    });

    it('should validate required fields', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/Reshare')
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
