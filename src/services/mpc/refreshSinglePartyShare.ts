import { refreshShares } from '@dynamic-labs-wallet/server';
import { EAC } from '../../types/credentials';
import { evervaultEncrypt } from '../evervault';

export const refreshSinglePartyShare = async (roomId: string, eac: EAC) => {
  const { serverKeyShare, chain } = eac;

  const refreshedServerKeyShare = await refreshShares({
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
