import {
  SignMessage200Type,
  SignMessage400Type,
  SignMessageRequestType,
} from '../../../generated';
import { evmClient } from '../../../services/mpc/constants';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/SignMessage
 */

export const SignMessage: TypedRequestHandler<{
  request: {
    body: SignMessageRequestType;
  };
  response: {
    body: SignMessage200Type | SignMessage400Type;
    statusCode: 200 | 400;
  };
}> = async (req, res) => {
  const { chainName, message, accountAddress, password } = req.body;
  await evmClient.authenticateApiToken();

  if (chainName === 'EVM') {
    const serializedSignature = await evmClient.signMessage({
      message,
      accountAddress,
      password,
    });
    return res.status(200).json({
      serializedSignature,
    });
  } else {
    throw new Error('Unsupported chain');
  }
};
