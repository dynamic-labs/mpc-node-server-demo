import { ThresholdSignatureScheme } from '@dynamic-labs-wallet/core';
import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import * as evervault from '../../../services/evervault';
import * as jwtService from '../../../services/jwt';
import { mpcClient } from '../../../services/mpc/constants';
import * as getSingleServerPartyKeygenId from '../../../services/mpc/getSingleServerPartyKeygenId';

// Mock the MPC client
jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    createMpcRoom: jest.fn(),
    reshareStrategy: jest.fn(),
  },
}));

jest.mock('../../../services/jwt');

describe('CreateRoomForReshare', () => {
  // Cast the mock to retain type information
  const mockCreateMpcRoom = jest.mocked(mpcClient.createMpcRoom);
  const mockReshareStrategy = jest.mocked(mpcClient.reshareStrategy);
  const evervaultDecryptSpy = jest.spyOn(evervault, 'evervaultDecrypt');
  const evervaultEncryptSpy = jest.spyOn(evervault, 'evervaultEncrypt');
  const getSingleServerPartyKeygenIdSpy = jest.spyOn(
    getSingleServerPartyKeygenId,
    'getSingleServerPartyKeygenId',
  );

  const mockJwt = `${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}`;
  const mockServerEac = {
    userId: faker.string.uuid(),
    compressedPublicKey: '123',
    uncompressedPublicKey: '123',
    accountAddress: faker.finance.ethereumAddress(),
    environmentId: faker.string.uuid(),
    serverKeygenInitResult: {
      keygenId: 'mockKeygenId',
    },
    serverKeyShare: '123',
    chain: 'EVM',
    derivationPath: '123',
  };

  const mockRoomId = faker.string.uuid();
  const mockServerKeygenId = faker.string.uuid();

  beforeEach(() => {
    jest.clearAllMocks();
    evervaultDecryptSpy.mockImplementation((eac) => Promise.resolve(eac));
    evervaultEncryptSpy.mockImplementation(async (str) => `ev:${str}`);
    mockReshareStrategy.mockResolvedValue({
      newServerKeygenInitResults: ['mockKeygenInitResult-1'],
      newServerKeygenIds: ['mockKeygenId-1'],
      existingServerKeygenIds: ['mockKeygenId-2'],
    });
    (jwtService.verifyJWT as jest.Mock).mockResolvedValue({
      isVerified: true,
      verifiedPayload: undefined,
    });
  });

  describe('POST /api/v1/actions/CreateRoomForReshare', () => {
    it('should create a room and return the room id', async () => {
      mockCreateMpcRoom.mockResolvedValue({
        roomId: mockRoomId,
      });
      getSingleServerPartyKeygenIdSpy.mockResolvedValue(mockServerKeygenId);

      const mockRequestBody = {
        oldThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_TWO,
        newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
        serverEacs: [JSON.stringify(mockServerEac)],
        jwt: mockJwt,
      };

      const result = await testServer.app
        .post('/api/v1/actions/CreateRoomForReshare')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send(mockRequestBody);

      expect(result.status).toBe(200);
    });

    it('should properly filter and handle existing server EACs', async () => {
      mockCreateMpcRoom.mockResolvedValue({ roomId: mockRoomId });
      evervaultDecryptSpy.mockImplementation((eac) => Promise.resolve(eac));

      // Mock different keygenIds for the two input EACs
      getSingleServerPartyKeygenIdSpy.mockImplementation(({ eac }) => {
        const serverKeygenInitResult = JSON.parse(eac.serverKeygenInitResult);
        return Promise.resolve(serverKeygenInitResult.keygenId);
      });

      mockReshareStrategy.mockResolvedValue({
        newServerKeygenInitResults: ['mockKeygenInitResult-1'],
        newServerKeygenIds: ['mockKeygenId-1'],
        existingServerKeygenIds: ['mockKeygenId-2'],
      });

      const mockRequestBody = {
        oldThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_TWO,
        newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
        serverEacs: [
          JSON.stringify({
            ...mockServerEac,
            serverKeygenInitResult: {
              keygenId: 'mockKeygenId-2',
            },
          }),
          JSON.stringify({
            ...mockServerEac,
            serverKeygenInitResult: {
              keygenId: 'mockKeygenId-3',
            },
          }),
        ],
      };

      const result = await testServer.app
        .post('/api/v1/actions/CreateRoomForReshare')
        .set('Accept', 'application/json')
        .send(mockRequestBody);

      expect(result.status).toBe(200);
      expect(result.body.serverEacs).toHaveLength(1);
    });

    it('should throw an error if the serverEacs are not provided', async () => {
      const mockRequestBody = {
        oldThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_TWO,
        newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
        jwt: mockJwt,
      };

      const result = await testServer.app
        .post('/api/v1/actions/CreateRoomForReshare')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send(mockRequestBody);

      expect(result.status).toBe(400);
      expect(result.body.error_code).toBe('missing_eac');
      expect(result.body.error_message).toBe(
        'At least one EAC is required for this operation',
      );
    });
  });
});
