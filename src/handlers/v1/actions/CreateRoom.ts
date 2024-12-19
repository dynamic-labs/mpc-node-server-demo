import {
  CreateRoom200Type,
  CreateRoom400Type,
  CreateRoom403Type,
  CreateRoom500Type,
  CreateRoomRequestType,
} from '../../../generated';
import { createMpcRoom } from '../../../services/wallets';
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
    const { chain } = req.body;
    const { roomId } = await createMpcRoom({ chain });

    // Return the room id to the client
    return res.status(200).json({
      roomId,
    });
  } catch (error) {
    next(error);
  }
};
