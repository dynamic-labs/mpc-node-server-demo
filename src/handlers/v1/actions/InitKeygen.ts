import {
  ThresholdSignatureScheme,
  initKeygen,
} from '@dynamic-labs-wallet/server';
import {
  InitKeygen200Type,
  InitKeygen400Type,
  InitKeygen403Type,
  InitKeygen500Type,
  InitKeygenRequestType,
} from '../../../generated';
import { evervaultEncrypt } from '../../../services/evervault';
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
    const { chain, environmentId, userId, thresholdSignatureScheme } = req.body;

    if (!thresholdSignatureScheme) {
      throw new Error('Threshold signature scheme is required');
    }

    const { roomId, keygenInitResults } = await initKeygen({
      chain,
      thresholdSignatureScheme:
        thresholdSignatureScheme as ThresholdSignatureScheme,
    });

    const serverKeygenIds: string[] = keygenInitResults.map(
      (result: any) => result.keygenId,
    );

    const eacs: string[] = [];
    for (const keygenInitResult of keygenInitResults) {
      // Initial Encrypted Account Credential
      const rawEac: InitialEAC = {
        userId,
        serverKeygenInitResult: JSON.stringify(keygenInitResult),
        environmentId,
        chain,
      };

      const eac = await evervaultEncrypt(JSON.stringify(rawEac));
      eacs.push(eac);
    }

    // Return the keygen room id and server keygen id to the client
    return res.status(200).json({
      roomId,
      serverKeygenIds,
      serverEacs: eacs,
    });
  } catch (error) {
    next(error);
  }
};
