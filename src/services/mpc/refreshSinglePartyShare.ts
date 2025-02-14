import { EacType } from '../../generated';
import { evervaultEncrypt } from '../evervault';
import { SERVER_KEY_SHARE_IS_MISSING_ERROR, mpcClient } from './constants';

export const refreshSinglePartyShare = async ({
  roomId,
  eac,
}: {
  roomId: string;
  eac: EacType;
}) => {
  const { serverKeyShare, chain } = eac;
  if (!serverKeyShare) {
    throw new Error(SERVER_KEY_SHARE_IS_MISSING_ERROR);
  }

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
