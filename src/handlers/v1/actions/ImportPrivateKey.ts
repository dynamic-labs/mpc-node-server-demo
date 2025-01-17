import { importPrivateKey } from '@dynamic-labs/dynamic-wallet-server';
import {
  ImportPrivateKey200Type,
  ImportPrivateKey400Type,
  ImportPrivateKey403Type,
  ImportPrivateKey500Type,
  ImportPrivateKeyRequestType,
} from '../../../generated';
import { evervaultEncrypt } from '../../../services/evervault';
import { EAC } from '../../../types/credentials';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/ImportPrivateKey
 */
export const ImportPrivateKey: TypedRequestHandler<{
  request: {
    body: ImportPrivateKeyRequestType;
  };
  response: {
    body:
      | ImportPrivateKey200Type
      | ImportPrivateKey400Type
      | ImportPrivateKey403Type
      | ImportPrivateKey500Type;
    statusCode: 200 | 400 | 403 | 500;
  };
}> = async (req, res, next) => {
  try {
    const { eac, roomId, clientPrimaryKeygenId, clientSecondaryKeygenId } =
      req.body;

    const { userId, serverKeygenInitResult, environmentId, chain } = eac;

    const {
      accountAddress,
      compressedPublicKey,
      uncompressedPublicKey,
      serverShare,
    } = await importPrivateKey({
      chain,
      roomId,
      serverKeygenInitResult: JSON.parse(serverKeygenInitResult) as any,
      clientPrimaryKeygenId,
      clientSecondaryKeygenId,
    });
    console.log('accountAddress', accountAddress);
    console.log('compressedPublicKey', compressedPublicKey);
    console.log('uncompressedPublicKey', uncompressedPublicKey);

    // Encrypted Account Credential
    const rawEac: EAC = {
      userId,
      compressedPublicKey,
      uncompressedPublicKey,
      accountAddress,
      serverKeygenInitResult,
      serverKeyShare: JSON.stringify(serverShare),
      environmentId,
      chain,
    };

    const modifiedEac = await evervaultEncrypt(JSON.stringify(rawEac));

    console.log({
      userId,
      environmentId,
      accountAddress: accountAddress as any,
      uncompressedPublicKey: uncompressedPublicKey,
      compressedPublicKey: compressedPublicKey?.toString(),
      eac: modifiedEac,
    });
    return res.status(200).json({
      userId,
      environmentId,
      accountAddress: accountAddress as any,
      uncompressedPublicKey: uncompressedPublicKey,
      compressedPublicKey: compressedPublicKey,
      eac: modifiedEac,
    });
  } catch (error) {
    next(error);
  }
};
