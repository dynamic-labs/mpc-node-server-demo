import {
  CreateRoomPartiesOptions,
  ThresholdSignatureScheme,
} from '@dynamic-labs-wallet/core';
import { BadRequest } from 'express-openapi-validator/dist/framework/types';
import {
  CreateRoomForReshare200Type,
  CreateRoomForReshare400Type,
  CreateRoomForReshare403Type,
  CreateRoomForReshare500Type,
  CreateRoomForReshareRequestType,
  EacType,
  PartialEacType,
} from '../../../generated';
import { evervaultEncrypt } from '../../../services/evervault';
import { mpcClient } from '../../../services/mpc/constants';
import { getSingleServerPartyKeygenId } from '../../../services/mpc/getSingleServerPartyKeygenId';
import { InitialEAC } from '../../../types/credentials';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/CreateRoom
 */
export const CreateRoomForReshare: TypedRequestHandler<{
  request: {
    body: CreateRoomForReshareRequestType;
  };
  response: {
    body:
      | CreateRoomForReshare200Type
      | CreateRoomForReshare400Type
      | CreateRoomForReshare403Type
      | CreateRoomForReshare500Type;
    statusCode: 200 | 400 | 403 | 500;
  };
}> = async (req, res, next) => {
  try {
    const {
      oldThresholdSignatureScheme,
      newThresholdSignatureScheme,
      serverEacs,
    } = req.body;

    if (!serverEacs) {
      throw new BadRequest({
        path: '/api/v1/actions/CreateRoomForReshare',
        message: 'Server EACs are required',
      });
    }

    const { chain } = serverEacs[0];

    const { roomId } = await mpcClient.createMpcRoom({
      chain,
      thresholdSignatureScheme:
        newThresholdSignatureScheme as ThresholdSignatureScheme,
      parties: CreateRoomPartiesOptions.FULL,
    });

    const { newServerKeygenInitResults, newServerKeygenIds } =
      await mpcClient.reshareStrategy({
        chain,
        oldThresholdSignatureScheme:
          oldThresholdSignatureScheme as ThresholdSignatureScheme,
        newThresholdSignatureScheme:
          newThresholdSignatureScheme as ThresholdSignatureScheme,
      });

    const serverKeygenIds = await Promise.all(
      serverEacs.map((eac: PartialEacType) =>
        getSingleServerPartyKeygenId({ eac: eac as EacType, chain }),
      ),
    );
    const encryptedServerEacs = await Promise.all(
      serverEacs.map((eac) => evervaultEncrypt(JSON.stringify(eac))),
    );

    const encryptedNewServerEacs = await Promise.all(
      newServerKeygenInitResults.map((keygenInitResult) => {
        const rawEac: InitialEAC = {
          userId: serverEacs[0].userId,
          serverKeygenInitResult: JSON.stringify(keygenInitResult),
          environmentId: serverEacs[0].environmentId,
          chain,
        };

        return evervaultEncrypt(JSON.stringify(rawEac));
      }),
    );

    return res.status(200).json({
      roomId,
      serverKeygenIds,
      serverEacs: encryptedServerEacs,
      newServerKeygenIds,
      newServerEacs: encryptedNewServerEacs,
    });
  } catch (error) {
    next(error);
  }
};
