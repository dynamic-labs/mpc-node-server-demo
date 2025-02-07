import { faker } from '@faker-js/faker';
import { testServer } from '../../../../tests/TestServer';
import { EacType } from '../../../generated';
import * as signSingleServerPartyMessage from '../../../services/mpc/signSingleServerPartyMessage';

describe('SignMessage', () => {
  const signSingleServerPartyMessageSpy = jest.spyOn(
    signSingleServerPartyMessage,
    'signSingleServerPartyMessage',
  );

  const mockRoomId = faker.string.uuid();
  const _mockServerKeygenId = faker.string.uuid();
  const mockServerEac: EacType = {
    userId: faker.string.uuid(),
    uncompressedPublicKey: faker.string.hexadecimal(),
    accountAddress: faker.string.hexadecimal(),
    environmentId: faker.string.uuid(),
    serverKeygenInitResult: faker.string.hexadecimal(),
    compressedPublicKey: faker.string.hexadecimal(),
    chain: 'EVM',
    derivationPath: faker.string.hexadecimal(),
  };
  const mockMessage = faker.string.hexadecimal();

  beforeEach(() => {
    jest.clearAllMocks();
    signSingleServerPartyMessageSpy.mockResolvedValue();
  });

  describe('POST /api/v1/actions/SignMessage', () => {
    it('should initialize keygen and return the room id and keygen init results', async () => {
      const result = await testServer.app
        .post('/api/v1/actions/SignMessage')
        .set('Accept', 'application/json')
        .send({
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockServerEac)],
          message: mockMessage,
        });

      console.log('result', result.body);
      expect(result.status).toBe(201);
      expect(result).toSatisfyApiSpec();
      expect(signSingleServerPartyMessageSpy).toHaveBeenCalled();
    });

    it('should return 500 if the sign message fails', async () => {
      signSingleServerPartyMessageSpy.mockRejectedValue(
        new Error('SignMessage failed'),
      );

      const result = await testServer.app
        .post('/api/v1/actions/SignMessage')
        .set('Accept', 'application/json')
        .send({
          roomId: mockRoomId,
          serverEacs: [JSON.stringify(mockServerEac)],
          message: mockMessage,
        });

      expect(result.status).toBe(500);
      expect(result).toSatisfyApiSpec();
      expect(result.body.error_code).toBe('unknown_error');
      expect(result.body.error_message).toBe('SignMessage failed');
    });
  });
});
