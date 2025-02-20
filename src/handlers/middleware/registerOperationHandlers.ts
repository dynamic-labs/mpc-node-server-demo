import path from 'path';
import { Express } from 'express';

import { middleware as OpenApiValidator } from 'express-openapi-validator';

import 'dotenv/config';
import { EacType, PartialEacType } from '../../generated';
import { evervaultDecrypt } from '../../services/evervault';
import { verifyJWT } from '../../services/jwt';

const isDeployedEnv = process.env.NODE_ENV === 'production';

/**
 * Helper function to process EACs
 * @param {string[]} eacs - The EACs to process
 * @returns {Promise<PartialEacType[] | undefined>} The processed EACs
 */
const processEacs = async (
  eacs: string[],
): Promise<PartialEacType[] | undefined> => {
  if (isDeployedEnv) {
    return eacs ? eacs.map((eac: string) => JSON.parse(eac)) : undefined;
  }

  return Promise.all(
    eacs.map(async (eac: string) => {
      const decryptedEACString = await evervaultDecrypt(eac);
      const parsedEac = JSON.parse(decryptedEACString);
      return {
        ...parsedEac,
        serverKeygenInitResult:
          typeof parsedEac.serverKeygenInitResult === 'string'
            ? parsedEac.serverKeygenInitResult
            : JSON.stringify(parsedEac.serverKeygenInitResult),
      } as PartialEacType;
    }),
  );
};

export const registerOperationHandlers = (app: Express) => {
  // EWC and EAC parsing middleware
  app.use(
    [
      '/api/v1/actions/CreateWalletAccount',
      '/api/v1/actions/ExportWalletAccount',
      '/api/v1/actions/SignMessage',
      '/api/v1/actions/RefreshShares',
      '/api/v1/actions/CreateRoom',
      '/api/v1/actions/ImportPrivateKey',
      '/api/v1/actions/Reshare',
      '/api/v1/actions/CreateRoomForReshare',
    ],
    async (req, _res, next) => {
      console.log('---original route---', req.originalUrl);

      if (req.body.serverEacs) {
        req.body.serverEacs = await processEacs(req.body.serverEacs);
        console.log('Processed serverEacs:', req.body.serverEacs);
      }

      if (req.body.newServerEacs) {
        req.body.newServerEacs = await processEacs(req.body.newServerEacs);
        console.log('Processed newServerEacs:', req.body.newServerEacs);
      }

      if (req.body.existingServerEacs) {
        req.body.existingServerEacs = await processEacs(
          req.body.existingServerEacs,
        );
        console.log(
          'Processed existingServerEacs:',
          req.body.existingServerEacs,
        );
      }

      next();
    },
  );

  app.use(
    '/api',
    OpenApiValidator({
      apiSpec: path.join(__dirname, '../../generated/openapi/api@v1.yaml'),
      validateRequests: {
        allowUnknownQueryParameters: false,
        coerceTypes: false,
        removeAdditional: 'failing',
      },
      validateResponses: true,
      operationHandlers: path.join(__dirname, '../../handlers/v1'),
    }),
  );

  //todo: add other actions that need this middleware
  app.use(['/api/v1/actions/CreateWalletAccount'], async (req, res, next) => {
    const { jwt, eac } = req.body;
    let environmentId, userId;
    if (eac) {
      ({ environmentId, userId } = eac as EacType);
    }

    if (!environmentId || !userId) {
      return res.status(403).send({
        error_code: 'jwt_invalid',
        error_message: 'The JWT could not be verified',
      });
    }
    const { isVerified } = await verifyJWT({
      environmentId,
      dynamicUserId: userId,
      rawJwt: jwt,
    });

    // If the JWT cannot be not verified, return unauthorized
    if (!isVerified) {
      return res.status(403).send({
        error_code: 'jwt_invalid',
        error_message: 'The JWT could not be verified',
      });
    }
    next();
  });
};
