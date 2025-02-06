import { reshareRemainingParty } from '@dynamic-labs-wallet/server';
import { Request, Response } from 'express';
import {
  ReshareRemainingParty200Type,
  ReshareRemainingParty400Type,
  ReshareRemainingParty403Type,
  ReshareRemainingParty500Type,
  ReshareRemainingPartyRequestType,
  badRequestErrorCode,
} from 'generated';
import { TypedRequestHandler } from 'types/express';
import { evervaultEncrypt } from '../../../services/evervault';
import { EAC } from '../../../types/credentials';

/**
 * /api/v1/actions/ReshareRemainingParty
 */
export const ReshareRemainingParty: TypedRequestHandler<{
  request: {
    body: ReshareRemainingPartyRequestType;
  };
  response: {
    body:
      | ReshareRemainingParty200Type
      | ReshareRemainingParty400Type
      | ReshareRemainingParty403Type
      | ReshareRemainingParty500Type;
    statusCode: 200 | 400 | 403 | 500;
  };
}> = (_req, res) => {
  // @TODO: Implement API SPEC according to expectation
  return res.status(400).json({
    error_message: 'Not implemented',
    error_code: badRequestErrorCode.bad_request,
  });

  // const { roomId, eac, clientKeygenId, clientBackupKeygenId, newThreshold } =
  //   req.body;
  // const { serverKeyShare, chain } = eac as EAC;
  // // Reshare the remaining party
  // const { serverKeyShare: refreshedServerKeyShare } =
  //   await reshareRemainingParty({
  //     chain,
  //     roomId,
  //     serverKeyShare: JSON.parse(serverKeyShare),
  //     clientKeygenId,
  //     clientBackupKeygenId,
  //     newThreshold,
  //   });

  // const rawEac: EAC = {
  //   ...eac,
  //   serverKeyShare: JSON.stringify(refreshedServerKeyShare),
  // };

  // const modifiedEac = await evervaultEncrypt(JSON.stringify(rawEac));

  // return res.status(200).json({
  //   eac: modifiedEac,
  // });
};
