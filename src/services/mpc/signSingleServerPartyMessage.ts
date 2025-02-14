import { EacType } from '../../generated';
import { mpcClient } from './constants';

export const signSingleServerPartyMessage = async ({
  message,
  roomId,
  eac,
}: {
  message: string;
  roomId: string;
  eac: EacType;
}) => {
  const { serverKeyShare, chain } = eac;
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
