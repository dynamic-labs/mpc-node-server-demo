import { EAC } from '../../types/credentials';
import { evervaultEncrypt } from '../evervault';
import { mpcClient } from './constants';

export const refreshSinglePartyShare = async (roomId: string, eac: EAC) => {
  const { serverKeyShare, chain } = eac;

  const refreshedServerKeyShare = await mpcClient.refreshShares({
    chain,
    roomId,
    serverKeyShare: JSON.parse(serverKeyShare),
  });

  const rawEac = {
    ...eac,
    serverKeyShare: JSON.stringify(refreshedServerKeyShare.serverKeyShare),
  };

  return evervaultEncrypt(JSON.stringify(rawEac));
};
