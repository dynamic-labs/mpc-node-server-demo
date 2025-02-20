import { ThresholdSignatureScheme } from '@dynamic-labs-wallet/server';
import { faker } from '@faker-js/faker';
import { EAC } from '../../types/credentials';
import { mpcClient } from './constants';
import { reshareSingleRemainingParty } from './reshareSingleRemainingParty';

jest.mock('./constants', () => ({
  mpcClient: {
    reshareRemainingParty: jest.fn(),
  },
}));

describe('reshareSingleRemainingParty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockServerKeyShare = '{"key": "value"}';
  const mockEac: EAC = {
    serverKeyShare: mockServerKeyShare,
    chain: 'EVM',
    userId: 'user123',
    uncompressedPublicKey: faker.string.uuid(),
    accountAddress: faker.finance.ethereumAddress(),
    environmentId: faker.string.uuid(),
    serverKeygenInitResult: faker.string.uuid(),
    derivationPath: faker.string.uuid(),
  };

  it('should call mpcClient.reshareRemainingParty with correct parameters', async () => {
    const mockReshareRemainingParty = jest
      .mocked(mpcClient.reshareRemainingParty)
      .mockResolvedValue({
        serverKeyShare: { key: 'newKeyShare' },
      });

    const mockParams = {
      roomId: 'room123',
      eac: mockEac,
      allPartyKeygenIds: ['id1', 'id2'],
      newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
    };

    await reshareSingleRemainingParty(mockParams);

    expect(mockReshareRemainingParty).toHaveBeenCalledWith({
      roomId: mockParams.roomId,
      serverKeyShare: JSON.parse(mockParams.eac.serverKeyShare),
      chain: mockParams.eac.chain,
      allPartyKeygenIds: mockParams.allPartyKeygenIds,
      newThreshold: 2,
    });
    expect(mockReshareRemainingParty).toHaveBeenCalledTimes(1);
  });

  it('should handle invalid JSON in serverKeyShare', async () => {
    jest.mocked(mpcClient.reshareRemainingParty);

    const mockParams = {
      roomId: 'room123',
      eac: {
        ...mockEac,
        serverKeyShare: JSON.parse(mockServerKeyShare),
      },
      allPartyKeygenIds: ['id1', 'id2'],
      newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
    };

    await expect(reshareSingleRemainingParty(mockParams)).rejects.toThrow(
      SyntaxError,
    );
  });
});
