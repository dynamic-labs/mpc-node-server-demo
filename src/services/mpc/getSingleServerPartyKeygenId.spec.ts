import { faker } from '@faker-js/faker';
import { EacType } from '../../generated';
import { SERVER_KEY_SHARE_IS_MISSING_ERROR, mpcClient } from './constants';
import { getSingleServerPartyKeygenId } from './getSingleServerPartyKeygenId';

jest.mock('./constants', () => ({
  mpcClient: {
    getKeygenId: jest.fn(),
  },
}));

describe('getSingleServerPartyKeygenId', () => {
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

  it('should call mpcClient.getKeygenId with correct parameters', async () => {
    const mockKeygenId = faker.string.uuid();
    const mockGetKeygenId = jest
      .mocked(mpcClient.getKeygenId)
      .mockResolvedValue(mockKeygenId);

    const mockParams = {
      chain: mockServerEac.chain,
      eac: mockServerEac,
    };

    const keygenId = await getSingleServerPartyKeygenId(mockParams);

    expect(keygenId).toBe(mockKeygenId);
    expect(mockGetKeygenId).toHaveBeenCalledWith({
      chainName: mockParams.eac.chain,
      serverKeyShare: JSON.parse(mockParams.eac.serverKeyShare as string),
    });
    expect(mockGetKeygenId).toHaveBeenCalledTimes(1);
  });

  it('should throw error when serverKeyShare is missing', async () => {
    const mockKeygenId = faker.string.uuid();
    const mockGetKeygenId = jest
      .mocked(mpcClient.getKeygenId)
      .mockResolvedValue(mockKeygenId);

    const mockParams = {
      chain: mockServerEac.chain,
      eac: { ...mockServerEac, serverKeyShare: undefined },
    };

    await expect(getSingleServerPartyKeygenId(mockParams)).rejects.toThrow(
      SERVER_KEY_SHARE_IS_MISSING_ERROR,
    );
    expect(mockGetKeygenId).not.toHaveBeenCalled();
  });
});
