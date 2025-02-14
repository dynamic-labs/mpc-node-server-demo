import {
  CreateRoomPartiesOptions,
  ThresholdSignatureScheme,
} from '@dynamic-labs-wallet/core';
import { BadRequest } from 'express-openapi-validator/dist/framework/types';
import {
  CreateRoom200Type,
  CreateRoom400Type,
  CreateRoom403Type,
  CreateRoom500Type,
  CreateRoomRequestType,
} from '../../../generated';
import { mpcClient } from '../../../services/mpc/constants';
import { getSingleServerPartyKeygenId } from '../../../services/mpc/getSingleServerPartyKeygenId';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/CreateRoom
 */
export const CreateRoom: TypedRequestHandler<{
  request: {
    body: CreateRoomRequestType;
  };
  response: {
    body:
      | CreateRoom200Type
      | CreateRoom400Type
      | CreateRoom403Type
      | CreateRoom500Type;
    statusCode: 200 | 400 | 403 | 500;
  };
}> = async (req, res, next) => {
  try {
    const { chain, thresholdSignatureScheme, serverEacs, parties } = req.body;

    const { roomId } = await mpcClient.createMpcRoom({
      chain,
      thresholdSignatureScheme:
        thresholdSignatureScheme as ThresholdSignatureScheme,
      parties: parties
        ? (parties as CreateRoomPartiesOptions)
        : CreateRoomPartiesOptions.THRESHOLD,
    });

    if (!serverEacs) {
      throw new BadRequest({
        path: '/api/v1/actions/CreateRoom',
        message: 'Server EACs are required',
      });
    }

    const serverKeygenIds = await Promise.all(
      serverEacs.map((eac) =>
        getSingleServerPartyKeygenId({
          eac,
          chain,
        }),
      ),
    );

    // Return the room id to the client
    return res.status(200).json({
      roomId,
      serverKeygenIds,
    });
  } catch (error) {
    next(error);
  }
};
