import {
  BIP340InitKeygenResult,
  EcdsaInitKeygenResult,
  Ed25519InitKeygenResult,
  MPC_CONFIG,
  ThresholdSignatureScheme,
} from '@dynamic-labs-wallet/server';
import { ChainType } from '@dynamic-labs-wallet/server/src/constants';
import { PartialEacType } from '../../generated';
import { evervaultEncrypt } from '../evervault';
import { mpcClient } from './constants';

export const reshareSingleNewParty = async ({
  chain,
  roomId,
  keygenInitResult,
  allPartyKeygenIds,
  baseServerEac, // TODO: refactor this hacky way of constructing the EAC
  oldThresholdSignatureScheme,
  newThresholdSignatureScheme,
}: {
  chain: ChainType;
  roomId: string;
  keygenInitResult:
    | Ed25519InitKeygenResult
    | EcdsaInitKeygenResult
    | BIP340InitKeygenResult;
  allPartyKeygenIds: string[];
  baseServerEac: PartialEacType;
  oldThresholdSignatureScheme: ThresholdSignatureScheme;
  newThresholdSignatureScheme: ThresholdSignatureScheme;
}) => {
  const { serverKeyShare: refreshedServerKeyShare } =
    await mpcClient.reshareNewParty({
      chain,
      roomId,
      keygenInitResult, // this needs to be the keyshare only
      allPartyKeygenIds,
      oldThreshold: MPC_CONFIG[oldThresholdSignatureScheme].threshold,
      newThreshold: MPC_CONFIG[newThresholdSignatureScheme].threshold,
    });

  const rawEac = {
    ...baseServerEac,
    serverKeyShare: JSON.stringify(refreshedServerKeyShare),
  };

  return evervaultEncrypt(JSON.stringify(rawEac));
};
