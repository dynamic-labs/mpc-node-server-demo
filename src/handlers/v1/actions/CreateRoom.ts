import {
  CreateRoom200Type,
  CreateRoom400Type,
  CreateRoom403Type,
  CreateRoom500Type,
  CreateRoomRequestType,
} from '../../../generated';
import { createMpcRoom, getKeygenId } from '../../../services/wallets';
import { EAC } from '../../../types/credentials';
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
      const serverShare = JSON.parse((eac as EAC).serverShare);
      serverKeygenId = await getKeygenId({
        chainName: chain,
        clientKeyshare: serverShare,
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
