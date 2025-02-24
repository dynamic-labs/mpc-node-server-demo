import { faker } from '@faker-js/faker';
import {
  EacType,
  PartialEacType,
  thresholdSignatureScheme,
} from '../../generated';
import * as evervault from '../../services/evervault';
import { WALLET_ACCOUNT_CREATION_ERROR, mpcClient } from './constants';
import { createSingleWalletAccount } from './createSingleWalletAccount';

jest.mock('./constants', () => ({
  mpcClient: {
    createWalletAccount: jest.fn(),
  },
}));

describe('createSingleWalletAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockServerKeygenInitResulte = '{"key": "value"}';
  const mockPartialEac: PartialEacType = {
    serverKeygenInitResult: mockServerKeygenInitResulte,
    chain: 'EVM',
    userId: 'user123',
    environmentId: faker.string.uuid(),
  };

  const mockServerKeyShare = '{"key": "value"}';
  const mockServerEac: EacType = {
    serverKeyShare: mockServerKeyShare,
    chain: 'EVM',
    userId: 'user123',
    compressedPublicKey: faker.string.uuid(),
    uncompressedPublicKey: faker.string.uuid(),
    accountAddress: faker.finance.ethereumAddress(),
    environmentId: faker.string.uuid(),
    serverKeygenInitResult: faker.string.uuid(),
    derivationPath: new Uint32Array([1, 2, 3]).toString(),
  };

  it('should call mpcClient.createWalletAccount with correct parameters', async () => {
    const mockCreateWalletAccount = jest
      .mocked(mpcClient.createWalletAccount)
      .mockResolvedValue({
        accountAddress: mockServerEac.accountAddress,
        compressedPublicKey: mockServerEac.compressedPublicKey as string,
        uncompressedPublicKey: mockServerEac.uncompressedPublicKey,
        serverKeyShare: mockServerEac.serverKeyShare,
        derivationPath: new Uint32Array([1, 2, 3]),
      });
    const evervaultEncryptSpy = jest.spyOn(evervault, 'evervaultEncrypt');

    evervaultEncryptSpy.mockResolvedValue('ev:encrypted:string');

    const mockParams = {
      eac: mockPartialEac,
      roomId: faker.string.uuid(),
      clientKeygenIds: [faker.string.uuid()],
      serverKeygenIds: [faker.string.uuid()],
      thresholdSignatureScheme: thresholdSignatureScheme.TWO_OF_THREE,
    };

    await createSingleWalletAccount(mockParams);

    expect(mockCreateWalletAccount).toHaveBeenCalledWith({
      chain: mockParams.eac.chain,
      roomId: mockParams.roomId,
      serverKeygenInitResult: JSON.parse(mockParams.eac.serverKeygenInitResult),
      keygenIds: [...mockParams.serverKeygenIds, ...mockParams.clientKeygenIds],
      thresholdSignatureScheme: mockParams.thresholdSignatureScheme,
    });
    expect(mockCreateWalletAccount).toHaveBeenCalledTimes(1);
  });

  it('should throw error if created wallet account is missing required fields', async () => {
    const mockCreateWalletAccount = jest
      .mocked(mpcClient.createWalletAccount)
      .mockResolvedValue({
        accountAddress: '',
        compressedPublicKey: '',
        uncompressedPublicKey: '',
        serverKeyShare: '',
        derivationPath: new Uint32Array(),
      });

    const mockParams = {
      eac: mockPartialEac,
      roomId: faker.string.uuid(),
      clientKeygenIds: [faker.string.uuid()],
      serverKeygenIds: [faker.string.uuid()],
      thresholdSignatureScheme: thresholdSignatureScheme.TWO_OF_THREE,
    };

    await expect(createSingleWalletAccount(mockParams)).rejects.toThrow(
      WALLET_ACCOUNT_CREATION_ERROR,
    );
    expect(mockCreateWalletAccount).toHaveBeenCalledTimes(1);
  });
});
