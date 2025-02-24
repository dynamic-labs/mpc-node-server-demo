import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import * as evervault from '../../../services/evervault';
import * as jwtService from '../../../services/jwt';
import { mpcClient } from '../../../services/mpc/constants';

// Mock the MPC client
jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    initKeygen: jest.fn(),
  },
}));

jest.mock('../../../services/jwt');

describe('InitKeygen', () => {
  // Cast the mock to retain type information
  const mockInitKeygen = jest.mocked(mpcClient.initKeygen);
  const evervaultEncryptSpy = jest.spyOn(evervault, 'evervaultEncrypt');

  const mockJwt = `${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}`;
  const mockRoomId = faker.string.uuid();
  const mockServerKeygenId = faker.string.uuid();
  const mockInitKeygenResult = {
    roomId: mockRoomId,
    keygenInitResults: [
      {
        keygenId: mockServerKeygenId,
        keygenInitResult: faker.string.uuid(),
        keygenSecret: faker.string.uuid(),
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    evervaultEncryptSpy.mockResolvedValue('ev:123');
    mockInitKeygen.mockResolvedValue(mockInitKeygenResult);
    (jwtService.verifyJWT as jest.Mock).mockResolvedValue({
      isVerified: true,
      verifiedPayload: undefined,
    });
  });

  describe('POST /api/v1/actions/InitKeygen', () => {
    it('should initialize keygen and return the room id and keygen init results', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/InitKeygen')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          chain: 'EVM',
          thresholdSignatureScheme: 'TWO_OF_THREE',
          environmentId: faker.string.uuid(),
          userId: faker.string.uuid(),
          jwt: mockJwt,
        });

      expect(result.status).toBe(200);
      expect(result).toSatisfyApiSpec();
      expect(result.body.roomId).toBe(mockRoomId);
      expect(result.body.serverKeygenIds).toEqual([mockServerKeygenId]);
      expect(mockInitKeygen).toHaveBeenCalled();
    });

    it('should return 500 if the keygen fails', async () => {
      mockInitKeygen.mockRejectedValue(new Error('Keygen failed'));

      const result = await testServer.app
        .post('/api/v1/actions/InitKeygen')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          chain: 'EVM',
          thresholdSignatureScheme: 'TWO_OF_THREE',
          environmentId: faker.string.uuid(),
          userId: faker.string.uuid(),
          jwt: mockJwt,
        });

      expect(result.status).toBe(500);
      expect(result).toSatisfyApiSpec();
      expect(result.body.error_code).toBe('unknown_error');
      expect(result.body.error_message).toBe('Keygen failed');
    });
  });
});
