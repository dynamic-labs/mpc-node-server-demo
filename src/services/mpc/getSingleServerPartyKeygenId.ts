import { ChainType } from '../../generated';
import { EAC } from '../../types/credentials';
import { mpcClient } from './constants';

export const getSingleServerPartyKeygenId = async (
  serverEac: EAC,
  chain: ChainType,
): Promise<string> => {
  if (!serverEac.serverKeyShare) {
    throw new Error('Server key share is required');
  }
  const serverKeyShare = JSON.parse(serverEac.serverKeyShare);

  const serverKeygenId = await mpcClient.getKeygenId({
    chainName: chain,
    serverKeyShare: serverKeyShare,
  });

  return serverKeygenId;
};
