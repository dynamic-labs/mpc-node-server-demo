import { faker } from '@faker-js/faker';
import { EacType } from '../../generated';
import { mpcClient } from './constants';
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
    derivationPath: faker.string.uuid(),
  };

  it('should call mpcClient.signMessage with correct parameters', async () => {
    const mockSignMessage = jest.mocked(mpcClient.signMessage);

    const mockParams = {
      message: 'test message',
      roomId: 'room123',
      serverEac: mockServerEac,
    };

    await signSingleServerPartyMessage(mockParams);

    expect(mockSignMessage).toHaveBeenCalledWith({
      message: mockParams.message,
      roomId: mockParams.roomId,
      serverKeyShare: JSON.parse(mockParams.serverEac.serverKeyShare as string),
      chain: mockParams.serverEac.chain,
    });
    expect(mockSignMessage).toHaveBeenCalledTimes(1);
  });

  it('should throw error when serverKeyShare is missing', async () => {
    const mockSignMessage = jest.mocked(mpcClient.signMessage);

    const mockParams = {
      message: 'test message',
      roomId: 'room123',
      serverEac: { ...mockServerEac, serverKeyShare: undefined },
    };

    // Act & Assert
    await expect(signSingleServerPartyMessage(mockParams)).rejects.toThrow(
      'Server key share is required',
    );
    expect(mockSignMessage).not.toHaveBeenCalled();
  });

  it('should handle invalid JSON in serverKeyShare', async () => {
    const _mockSignMessage = jest.mocked(mpcClient.signMessage);

    const mockParams = {
      message: 'test message',
      roomId: 'room123',
      serverEac: {
        ...mockServerEac,
        serverKeyShare: JSON.parse(mockServerKeyShare),
      },
    };

    await expect(signSingleServerPartyMessage(mockParams)).rejects.toThrow(
      SyntaxError,
    );
  });
});
