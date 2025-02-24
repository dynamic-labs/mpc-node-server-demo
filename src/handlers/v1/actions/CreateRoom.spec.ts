import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import type { EacType } from '../../../generated';
import * as evervault from '../../../services/evervault';
import * as jwtService from '../../../services/jwt';
import { mpcClient } from '../../../services/mpc/constants';
import * as getSingleServerPartyKeygenId from '../../../services/mpc/getSingleServerPartyKeygenId';

// Mock the MPC client
jest.mock('../../../services/mpc/constants', () => ({
  mpcClient: {
    createMpcRoom: jest.fn(),
  },
}));

jest.mock('../../../services/jwt');

describe('CreateRoom', () => {
  // Cast the mock to retain type information
  const mockCreateMpcRoom = jest.mocked(mpcClient.createMpcRoom);
  const evervaultDecryptSpy = jest.spyOn(evervault, 'evervaultDecrypt');
  const getSingleServerPartyKeygenIdSpy = jest.spyOn(
    getSingleServerPartyKeygenId,
    'getSingleServerPartyKeygenId',
  );

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

  const mockRoomId = faker.string.uuid();
  const mockServerKeygenId = faker.string.uuid();

  beforeEach(() => {
    jest.clearAllMocks();
    evervaultDecryptSpy.mockResolvedValue(JSON.stringify(mockServerEac));
    (jwtService.verifyJWT as jest.Mock).mockResolvedValue({
      isVerified: true,
      verifiedPayload: undefined,
    });
  });

  describe('POST /api/v1/actions/CreateRoom', () => {
    it('should create a room and return the room id', async () => {
      mockCreateMpcRoom.mockResolvedValue({
        roomId: mockRoomId,
      });
      getSingleServerPartyKeygenIdSpy.mockResolvedValue(mockServerKeygenId);

      const result = await testServer.app
        .post('/api/v1/actions/CreateRoom')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({
          chain: 'EVM',
          thresholdSignatureScheme: 'TWO_OF_THREE',
          serverEacs: [JSON.stringify(mockServerEac)],
        });

      expect(result.status).toBe(200);
      expect(result).toSatisfyApiSpec();
      expect(result.body.roomId).toBe(mockRoomId);
      expect(result.body.serverKeygenIds).toEqual([mockServerKeygenId]);
      expect(mockCreateMpcRoom).toHaveBeenCalled();
      expect(getSingleServerPartyKeygenIdSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the serverEacs are not provided', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/CreateRoom')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockJwt}`)
        .send({ chain: 'EVM', thresholdSignatureScheme: 'TWO_OF_THREE' });

      expect(result.status).toBe(400);
      expect(result.body.error_code).toBe('missing_eac');
      expect(result.body.error_message).toBe(
        'At least one EAC is required for this operation',
      );
    });
  });
});
