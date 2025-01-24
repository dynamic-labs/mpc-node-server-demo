import { ThresholdSignatureScheme } from '../../../../../dynamic-wallet-sdk/packages/core/dist/mpc/constants';
import {
  createMpcRoom,
  getKeygenId,
} from '../../../../../dynamic-wallet-sdk/packages/server/src/mpc/mpc';
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
    const { chain, thresholdSignatureScheme, autherizedServerEac } = req.body;
    const { roomId } = await createMpcRoom({
      chain,
      thresholdSignatureScheme:
        thresholdSignatureScheme as ThresholdSignatureScheme,
    });

    console.log('eac', autherizedServerEac);
    let serverKeygenId: string | undefined;
    if (autherizedServerEac) {
      if (!autherizedServerEac.serverKeyShare) {
        throw new Error('Server key share is required');
      }
      const serverKeyShare = JSON.parse(autherizedServerEac.serverKeyShare);
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
