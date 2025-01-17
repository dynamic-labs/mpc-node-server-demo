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
  EacType,
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
    const { chain, parties, eac } = req.body;
    const { roomId } = await createMpcRoom({ chain, parties });

    console.log('eac', eac);
    let serverKeygenId: string | undefined;
    if (eac) {
      if (!eac.serverKeyShare) {
        throw new Error('Server key share is required');
      }
      const serverKeyShare = JSON.parse(eac.serverKeyShare);
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
