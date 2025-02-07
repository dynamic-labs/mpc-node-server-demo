import {
  SignMessage201Type,
  SignMessage400Type,
  SignMessage403Type,
  SignMessage500Type,
  SignMessageRequestType,
} from '../../../generated';
import { signSingleServerPartyMessage } from '../../../services/mpc/signSingleServerPartyMessage';
import { EAC } from '../../../types/credentials';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/SignMessage
 */

export const SignMessage: TypedRequestHandler<{
  request: {
    body: SignMessageRequestType;
  };
  response: {
    body:
      | SignMessage201Type
      | SignMessage400Type
      | SignMessage403Type
      | SignMessage500Type;
    statusCode: 201 | 400 | 403 | 500;
  };
}> = async (req, res, next) => {
  try {
    const { message, roomId, serverEacs } = req.body;

    await Promise.all(
      serverEacs.map((serverEac) =>
        // @todo: Fix this type error with serverEac
        signSingleServerPartyMessage(message, roomId, serverEac as EAC),
      ),
    );

    return res.status(201).send();
  } catch (error) {
    next(error);
  }
};
