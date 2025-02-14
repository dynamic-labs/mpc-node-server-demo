import { faker } from '@faker-js/faker';
import { EacType } from '../../generated';
import { SERVER_KEY_SHARE_IS_MISSING_ERROR, mpcClient } from './constants';
import { refreshSinglePartyShare } from './refreshSinglePartyShare';

jest.mock('./constants', () => ({
  mpcClient: {
    refreshShares: jest.fn(),
  },
}));

describe('refreshSinglePartyShare', () => {
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

  it('should call mpcClient.refreshShares with correct parameters', async () => {
    const mockRefreshShares = jest
      .mocked(mpcClient.refreshShares)
      .mockResolvedValue({
        serverKeyShare: { key: 'newKeyShare' },
      });

    const mockParams = {
      roomId: 'room123',
      eac: mockServerEac,
    };

    await refreshSinglePartyShare(mockParams);

    expect(mockRefreshShares).toHaveBeenCalledWith({
      roomId: mockParams.roomId,
      serverKeyShare: JSON.parse(mockParams.eac.serverKeyShare as string),
      chain: mockParams.eac.chain,
    });
    expect(mockRefreshShares).toHaveBeenCalledTimes(1);
  });

  it('should throw error when serverKeyShare is missing', async () => {
    const mockRefreshShares = jest.mocked(mpcClient.refreshShares);

    const mockParams = {
      roomId: 'room123',
      eac: { ...mockServerEac, serverKeyShare: undefined },
    };

    // Act & Assert
    await expect(refreshSinglePartyShare(mockParams)).rejects.toThrow(
      SERVER_KEY_SHARE_IS_MISSING_ERROR,
    );
    expect(mockRefreshShares).not.toHaveBeenCalled();
  });

  it('should handle invalid JSON in serverKeyShare', async () => {
    jest.mocked(mpcClient.refreshShares);

    const mockParams = {
      roomId: 'room123',
      eac: {
        ...mockServerEac,
        serverKeyShare: JSON.parse(mockServerKeyShare),
      },
    };

    await expect(refreshSinglePartyShare(mockParams)).rejects.toThrow(
      SyntaxError,
    );
  });
});
