import {
  MPC_CONFIG,
  ThresholdSignatureScheme,
} from '@dynamic-labs-wallet/server';
import { EAC } from '../../types/credentials';
import { evervaultEncrypt } from '../evervault';
import { mpcClient } from './constants';

export const reshareSingleRemainingParty = async ({
  roomId,
  eac,
  allPartyKeygenIds,
  newThresholdSignatureScheme,
}: {
  roomId: string;
  eac: EAC;
  allPartyKeygenIds: string[];
  newThresholdSignatureScheme: ThresholdSignatureScheme;
}) => {
  const { serverKeyShare, chain } = eac;

  const { threshold } = MPC_CONFIG[newThresholdSignatureScheme];

  const { serverKeyShare: refreshedServerKeyShare } =
    await mpcClient.reshareRemainingParty({
      chain,
      roomId,
      serverKeyShare: JSON.parse(serverKeyShare),
      allPartyKeygenIds,
      newThreshold: threshold,
    });

  const rawEac = {
    ...eac,
    serverKeyShare: JSON.stringify(refreshedServerKeyShare),
  };

  return evervaultEncrypt(JSON.stringify(rawEac));
};
