import { ThresholdSignatureScheme } from '@dynamic-labs-wallet/server';
import {
  ReshareRemainingParty200Type,
  ReshareRemainingParty400Type,
  ReshareRemainingParty403Type,
  ReshareRemainingParty500Type,
  ReshareRemainingPartyRequestType,
} from '../../../generated';
import { reshareSingleNewParty } from '../../../services/mpc/reshareSingleNewParty';
import { reshareSingleRemainingParty } from '../../../services/mpc/reshareSingleRemainingParty';
import { EAC } from '../../../types/credentials';
import { TypedRequestHandler } from '../../../types/express';
/**
 * /api/v1/actions/Reshare
 */
export const Reshare: TypedRequestHandler<{
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
}> = async (req, res, next) => {
  try {
    const {
      serverEacs,
      roomId,
      allPartyKeygenIds,
      oldThresholdSignatureScheme,
      newThresholdSignatureScheme,
      newServerEacs,
    } = req.body;

    const { chain } = serverEacs[0];
    const { serverKeyShare, ...baseServerEac } = serverEacs[0] as EAC;

    const refreshedServerEacs = await Promise.all([
      ...serverEacs.map((serverEac) =>
        reshareSingleRemainingParty({
          roomId,
          eac: serverEac as EAC,
          allPartyKeygenIds,
          newThresholdSignatureScheme:
            newThresholdSignatureScheme as ThresholdSignatureScheme,
        }),
      ),
      ...newServerEacs.map((eac) =>
        reshareSingleNewParty({
          chain,
          roomId,
          keygenInitResult: JSON.parse(eac.serverKeygenInitResult),
          allPartyKeygenIds,
          baseServerEac,
          oldThresholdSignatureScheme:
            oldThresholdSignatureScheme as ThresholdSignatureScheme,
          newThresholdSignatureScheme:
            newThresholdSignatureScheme as ThresholdSignatureScheme,
        }),
      ),
    ]);

    return res.status(200).json({
      serverEacs: refreshedServerEacs,
    });
  } catch (error) {
    next(error);
  }
};
