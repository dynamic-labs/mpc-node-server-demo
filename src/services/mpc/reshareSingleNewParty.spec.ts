import { ThresholdSignatureScheme } from '@dynamic-labs-wallet/server';
import { ChainType } from '@dynamic-labs-wallet/server/src/constants';
import { faker } from '@faker-js/faker';
import { PartialEacType } from '../../generated';
import { mpcClient } from './constants';
import { reshareSingleNewParty } from './reshareSingleNewParty';

jest.mock('./constants', () => ({
  mpcClient: {
    reshareNewParty: jest.fn(),
  },
}));

describe('reshareSingleNewParty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockKeygenInitResult = { key: 'value' };
  const mockBaseServerEac: PartialEacType = {
    chain: 'EVM',
    userId: 'user123',
    environmentId: faker.string.uuid(),
    serverKeygenInitResult: faker.string.uuid(),
  };

  it('should call mpcClient.reshareNewParty with correct parameters', async () => {
    const mockReshareNewParty = jest
      .mocked(mpcClient.reshareNewParty)
      .mockResolvedValue({
        serverKeyShare: { key: 'newKeyShare' },
      });

    const mockParams = {
      chain: 'EVM' as ChainType,
      roomId: 'room123',
      keygenInitResult: mockKeygenInitResult,
      allPartyKeygenIds: ['id1', 'id2'],
      baseServerEac: mockBaseServerEac,
      oldThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_TWO,
      newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
    };

    await reshareSingleNewParty(mockParams);

    expect(mockReshareNewParty).toHaveBeenCalledWith({
      chain: mockParams.chain,
      roomId: mockParams.roomId,
      keygenInitResult: mockParams.keygenInitResult,
      allPartyKeygenIds: mockParams.allPartyKeygenIds,
      oldThreshold: 2,
      newThreshold: 2,
    });
    expect(mockReshareNewParty).toHaveBeenCalledTimes(1);
  });

  it('should handle different threshold signature schemes', async () => {
    const mockReshareNewParty = jest
      .mocked(mpcClient.reshareNewParty)
      .mockResolvedValue({
        serverKeyShare: { key: 'newKeyShare' },
      });

    const mockParams = {
      chain: 'EVM' as ChainType,
      roomId: 'room123',
      keygenInitResult: mockKeygenInitResult,
      allPartyKeygenIds: ['id1', 'id2'],
      baseServerEac: mockBaseServerEac,
      oldThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_TWO,
      newThresholdSignatureScheme: ThresholdSignatureScheme.TWO_OF_THREE,
    };

    await reshareSingleNewParty(mockParams);

    expect(mockReshareNewParty).toHaveBeenCalledWith({
      chain: mockParams.chain,
      roomId: mockParams.roomId,
      keygenInitResult: mockParams.keygenInitResult,
      allPartyKeygenIds: mockParams.allPartyKeygenIds,
      oldThreshold: 2,
      newThreshold: 2,
    });
  });
});
