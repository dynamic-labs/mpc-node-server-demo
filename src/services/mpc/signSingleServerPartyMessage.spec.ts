import { faker } from '@faker-js/faker';
import { EacType } from '../../generated';
import { SERVER_KEY_SHARE_IS_MISSING_ERROR, mpcClient } from './constants';
import { signSingleServerPartyMessage } from './signSingleServerPartyMessage';

jest.mock('./constants', () => ({
  mpcClient: {
    signMessage: jest.fn(),
  },
}));

describe('signSingleServerPartyMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockServerKeyShare = '{"key": "value"}';
  const mockServerEac: EacType = {
    serverKeyShare: mockServerKeyShare,
    chain: 'EVM',
    userId: 'user123',
    uncompressedPublicKey: faker.string.uuid(),
    accountAddress: faker.finance.ethereumAddress(),
    environmentId: faker.string.uuid(),
    serverKeygenInitResult: faker.string.uuid(),
    derivationPath: '',
  };

  it('should call mpcClient.signMessage with correct parameters', async () => {
    const mockSignMessage = jest.mocked(mpcClient.signMessage);

    const mockParams = {
      message: 'test message',
      roomId: 'room123',
      eac: mockServerEac,
      derivationPath: '',
    };

    await signSingleServerPartyMessage(mockParams);

    expect(mockSignMessage).toHaveBeenCalledWith({
      message: mockParams.message,
      roomId: mockParams.roomId,
      serverKeyShare: JSON.parse(mockParams.eac.serverKeyShare as string),
      chain: mockParams.eac.chain,
      derivationPath: mockParams.eac.derivationPath,
    });
    expect(mockSignMessage).toHaveBeenCalledTimes(1);
  });

  it('should throw error when serverKeyShare is missing', async () => {
    const mockSignMessage = jest.mocked(mpcClient.signMessage);

    const mockParams = {
      message: 'test message',
      roomId: 'room123',
      eac: { ...mockServerEac, serverKeyShare: undefined },
    };

    await expect(signSingleServerPartyMessage(mockParams)).rejects.toThrow(
      SERVER_KEY_SHARE_IS_MISSING_ERROR,
    );
    expect(mockSignMessage).not.toHaveBeenCalled();
  });

  it('should handle invalid JSON in serverKeyShare', async () => {
    jest.mocked(mpcClient.signMessage);

    const mockParams = {
      message: 'test message',
      roomId: 'room123',
      eac: {
        ...mockServerEac,
        serverKeyShare: JSON.parse(mockServerKeyShare),
        derivationPath: faker.string.uuid(),
      },
    };

    await expect(signSingleServerPartyMessage(mockParams)).rejects.toThrow(
      SyntaxError,
    );
  });
});
