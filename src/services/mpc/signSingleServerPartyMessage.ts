import { EacType } from '../../generated';
import { mpcClient } from './constants';

export const signSingleServerPartyMessage = async ({
  message,
  roomId,
  serverEac,
}: {
  message: string;
  roomId: string;
  serverEac: EacType;
}) => {
  const { serverKeyShare, chain } = serverEac;
  if (!serverKeyShare) {
    throw new Error('Server key share is required');
  }

  await mpcClient.signMessage({
    message,
    chain,
    roomId,
    serverKeyShare: JSON.parse(serverKeyShare),
  });
};
