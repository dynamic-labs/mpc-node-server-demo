import { ChainType, EacType } from '../../generated';
import { SERVER_KEY_SHARE_IS_MISSING_ERROR, mpcClient } from './constants';

export const getSingleServerPartyKeygenId = async ({
  eac,
  chain,
}: {
  eac: EacType;
  chain: ChainType;
}): Promise<string> => {
  if (!eac.serverKeyShare) {
    throw new Error(SERVER_KEY_SHARE_IS_MISSING_ERROR);
  }
  const serverKeyShare = JSON.parse(eac.serverKeyShare);

  const serverKeygenId = await mpcClient.getKeygenId({
    chainName: chain,
    serverKeyShare: serverKeyShare,
  });

  return serverKeygenId;
};
