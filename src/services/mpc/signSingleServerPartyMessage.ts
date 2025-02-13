import { EAC } from '../../types/credentials';
import { mpcClient } from './constants';

export const signSingleServerPartyMessage = async (
  message: string,
  roomId: string,
  serverEac: EAC,
) => {
  const { serverKeyShare, chain } = serverEac as EAC;
  await mpcClient.signMessage({
    message,
    chain,
    roomId,
    serverKeyShare: JSON.parse(serverKeyShare),
  });
};
