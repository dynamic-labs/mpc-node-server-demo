import path from 'path';
import { Express } from 'express';

import { middleware as OpenApiValidator } from 'express-openapi-validator';

import 'dotenv/config';
import { EacType, PartialEacType } from '../../generated';
import { evervaultDecrypt } from '../../services/evervault';
import { verifyJWT } from '../../services/jwt';

const isDeployedEnv = process.env.NODE_ENV === 'production';

export const registerOperationHandlers = (app: Express) => {
  // EWC and EAC parsing middleware
  //TODO: make sure i add all the routes that need this encryption middleware
  app.use(
    [
      '/api/v1/actions/CreateWalletAccount',
      '/api/v1/actions/ExportWalletAccount',
      '/api/v1/actions/SignMessage',
      '/api/v1/actions/RefreshShares',
      '/api/v1/actions/CreateRoom',
      '/api/v1/actions/ImportPrivateKey',
    ],
    async (req, _res, next) => {
      console.log('---original route---', req.originalUrl);
      if (req.body.serverEacs) {
        if (isDeployedEnv) {
          // encrypted account credential (EAC) should be decrypted on ingress
          const { serverEacs: decryptedEACStrings } = req.body;
          console.log('decryptedEACString', decryptedEACStrings);
          const eacs: PartialEacType[] = decryptedEACStrings
            ? decryptedEACStrings.map((eac: string) => JSON.parse(eac))
            : undefined;
          console.log('eacs', eacs);
          req.body.serverEacs = eacs;
        } else {
          const serverEacs = req.body.serverEacs;
          const serverEacParsed = await Promise.all(
            serverEacs.map(async (eac: string) => {
              const decryptedEACString = await evervaultDecrypt(eac);
              const parsedEac = JSON.parse(decryptedEACString);
              // Don't stringify serverKeygenInitResult if it's already a string
              return {
                ...parsedEac,
                serverKeygenInitResult:
                  typeof parsedEac.serverKeygenInitResult === 'string'
                    ? parsedEac.serverKeygenInitResult
                    : JSON.stringify(parsedEac.serverKeygenInitResult),
              } as PartialEacType;
            }),
          );
          req.body.serverEacs = serverEacParsed;
          console.log('Processed serverEacs:', req.body.serverEacs);
        }
      }
      console.log('next ');
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
