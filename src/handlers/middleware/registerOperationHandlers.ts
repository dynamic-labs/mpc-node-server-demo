import path from 'path';
import { Express } from 'express';

import { middleware as OpenApiValidator } from 'express-openapi-validator';

import 'dotenv/config';
import { EcdsaPublicKey } from '@sodot/sodot-node-sdk';
import { EacType } from '../../generated';
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
    ],
    async (req, _res, next) => {
      if (isDeployedEnv) {
        // encrypted account credential (EAC) should be decrypted on ingress
        const { eac: decryptedEACString } = req.body;
        const eac: EacType = decryptedEACString
          ? JSON.parse(decryptedEACString)
          : undefined;

        req.body.eac = eac;
      } else {
        const eac = await evervaultDecrypt(req.body.eac as string);
        console.log('HITTING EVERVAULT DECRYPT ------', { eac });
        const parsedEac = JSON.parse(eac);

        // // Convert hex strings to proper format
        // if (parsedEac.compressedPublicKey && typeof parsedEac.compressedPublicKey === 'string') {
        //   const buffer = Buffer.from(parsedEac.compressedPublicKey, 'hex');
        //   parsedEac.compressedPublicKey = new Uint8Array(buffer);
        // }

        // if (parsedEac.uncompressedPublicKey && typeof parsedEac.uncompressedPublicKey === 'string') {
        //   const buffer = Buffer.from(parsedEac.uncompressedPublicKey, 'hex');
        //   parsedEac.uncompressedPublicKey = new EcdsaPublicKey(new Uint8Array(buffer.slice(1))); // Remove the '04' prefix
        // }

        console.log('HITTING EVERVAULT DECRYPT 2 ------', { parsedEac });
        req.body.eac = parsedEac;
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
