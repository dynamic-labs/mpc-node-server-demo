import { ThresholdSignatureScheme } from '@dynamic-labs-wallet/core';
import { createMpcRoom, getKeygenId } from '@dynamic-labs-wallet/server';
import {
  CreateRoom200Type,
  CreateRoom400Type,
  CreateRoom403Type,
  CreateRoom500Type,
  CreateRoomRequestType,
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
    const { chain, thresholdSignatureScheme, authorizedServerEac } = req.body;
    const { roomId } = await createMpcRoom({
      chain,
      thresholdSignatureScheme:
        thresholdSignatureScheme as ThresholdSignatureScheme,
    });

    console.log('eac', authorizedServerEac);
    let serverKeygenId: string | undefined;
    if (authorizedServerEac) {
      if (!authorizedServerEac.serverKeyShare) {
        throw new Error('Server key share is required');
      }
      const serverKeyShare = JSON.parse(authorizedServerEac.serverKeyShare);
      serverKeygenId = await getKeygenId({
        chainName: chain,
        clientKeyshare: serverKeyShare,
      });
    }

    // Return the room id to the client
    return res.status(200).json({
      roomId,
      serverKeygenId,
    });
  } catch (error) {
    next(error);
  }
};
