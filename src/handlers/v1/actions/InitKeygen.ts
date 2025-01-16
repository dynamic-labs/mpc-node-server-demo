import { initKeygen } from '@dynamic-labs/dynamic-wallet-server';
import {
  InitKeygen200Type,
  InitKeygen400Type,
  InitKeygen403Type,
  InitKeygen500Type,
  InitKeygenRequestType,
} from '../../../generated';
import { evervaultEncrypt } from '../../../services/evervault';
// import { initKeygen } from '../../../services/wallets';
import { InitialEAC } from '../../../types/credentials';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/InitKeygen
 */
export const InitKeygen: TypedRequestHandler<{
  request: {
    body: InitKeygenRequestType;
  };
  response: {
    body:
      | InitKeygen200Type
      | InitKeygen400Type
      | InitKeygen403Type
      | InitKeygen500Type;
    statusCode: 200 | 400 | 403 | 500;
  };
}> = async (req, res, next) => {
  try {
    const { chain, environmentId, userId, parties } = req.body;

    const { roomId, keygenInitResult } = await initKeygen({
      chain,
      parties,
    });
    const serverKeygenId = keygenInitResult.keygenId;

    // Initial Encrypted Account Credential
    const rawEac: InitialEAC = {
      userId,
      serverKeygenInitResult: JSON.stringify(keygenInitResult),
      environmentId,
      chain,
    };

    const eac = await evervaultEncrypt(JSON.stringify(rawEac));

    // Return the keygen room id and server keygen id to the client
    return res.status(200).json({
      roomId,
      serverKeygenId,
      eac,
    });
  } catch (error) {
    next(error);
  }
};
