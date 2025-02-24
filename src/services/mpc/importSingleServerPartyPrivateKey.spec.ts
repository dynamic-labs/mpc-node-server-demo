import { faker } from '@faker-js/faker';
import {
  EacType,
  PartialEacType,
  thresholdSignatureScheme,
} from '../../generated';
import * as evervault from '../../services/evervault';
import { WALLET_ACCOUNT_CREATION_ERROR, mpcClient } from './constants';
import { importSingleServerPartyPrivateKey } from './importSingleServerPartyPrivateKey';

jest.mock('./constants', () => ({
  mpcClient: {
    importPrivateKey: jest.fn(),
  },
}));

describe('importSingleServerPartyPrivateKey', () => {
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

  it('should call mpcClient.importPrivateKey with correct parameters', async () => {
    const mockImportPrivateKey = jest
      .mocked(mpcClient.importPrivateKey)
      .mockResolvedValue({
        accountAddress: mockServerEac.accountAddress,
        compressedPublicKey: mockServerEac.compressedPublicKey as string,
        uncompressedPublicKey: mockServerEac.uncompressedPublicKey,
        serverKeyShare: mockServerEac.serverKeyShare,
        derivationPath: new Uint32Array([1, 2, 3]).toString(),
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

    await importSingleServerPartyPrivateKey(mockParams);

    expect(mockImportPrivateKey).toHaveBeenCalledWith({
      chain: mockParams.eac.chain,
      roomId: mockParams.roomId,
      serverKeygenInitResult: JSON.parse(mockParams.eac.serverKeygenInitResult),
      keygenIds: [...mockParams.serverKeygenIds, ...mockParams.clientKeygenIds],
      thresholdSignatureScheme: mockParams.thresholdSignatureScheme,
    });
    expect(mockImportPrivateKey).toHaveBeenCalledTimes(1);
  });

  it('should throw error if created wallet account is missing required fields', async () => {
    const mockImportPrivateKey = jest
      .mocked(mpcClient.importPrivateKey)
      .mockResolvedValue({
        accountAddress: '',
        compressedPublicKey: '',
        uncompressedPublicKey: mockServerEac.uncompressedPublicKey,
        serverKeyShare: mockServerEac.serverKeyShare,
        derivationPath: '',
      } as any);

    const mockParams = {
      eac: mockPartialEac,
      roomId: faker.string.uuid(),
      clientKeygenIds: [faker.string.uuid()],
      serverKeygenIds: [faker.string.uuid()],
      thresholdSignatureScheme: thresholdSignatureScheme.TWO_OF_THREE,
    };

    await expect(importSingleServerPartyPrivateKey(mockParams)).rejects.toThrow(
      WALLET_ACCOUNT_CREATION_ERROR,
    );
    expect(mockImportPrivateKey).toHaveBeenCalledTimes(1);
  });
});
