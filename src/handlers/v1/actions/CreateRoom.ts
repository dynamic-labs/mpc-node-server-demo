import { ThresholdSignatureScheme } from '@dynamic-labs-wallet/core';
import { createMpcRoom, getKeygenId } from '@dynamic-labs-wallet/server';
import { getSingleServerPartyKeygenId } from 'services/mpc/getSingleServerPartyKeygenId';
import { EAC } from 'types/credentials';
import {
  CreateRoom200Type,
  CreateRoom400Type,
  CreateRoom403Type,
  CreateRoom500Type,
  CreateRoomRequestType,
  PartialEacType,
} from '../../../generated';
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
    const { chain, thresholdSignatureScheme, serverEacs } = req.body;
    const { roomId } = await createMpcRoom({
      chain,
      thresholdSignatureScheme:
        thresholdSignatureScheme as ThresholdSignatureScheme,
    });

    if (!serverEacs) {
      throw new Error('Server EACs are required');
    }

    const serverKeygenIds = await Promise.all(
      serverEacs.map((eac: PartialEacType) =>
        getSingleServerPartyKeygenId(eac as EAC, chain),
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
