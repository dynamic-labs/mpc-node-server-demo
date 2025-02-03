import { getKeygenId } from '@dynamic-labs-wallet/server';
import { ChainType } from '../../generated';
import { EAC } from '../../types/credentials';

export const getSingleServerPartyKeygenId = async (
  serverEac: EAC,
  chain: ChainType,
): Promise<string> => {
  if (!serverEac.serverKeyShare) {
    throw new Error('Server key share is required');
  }
  const serverKeyShare = JSON.parse(serverEac.serverKeyShare);
  const serverKeygenId = await getKeygenId({
    chainName: chain,
    clientKeyshare: serverKeyShare,
  });

  return serverKeygenId;
};
