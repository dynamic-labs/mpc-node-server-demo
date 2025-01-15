import {
  CreateWalletAccount200Type,
  CreateWalletAccount400Type,
  CreateWalletAccount403Type,
  CreateWalletAccount500Type,
  CreateWalletAccountRequestType,
} from '../../../generated';
import { evervaultEncrypt } from '../../../services/evervault';
import { createWalletAccount } from '../../../services/wallets';
import { EAC } from '../../../types/credentials';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/CreateWalletAccount
 */
export const CreateWalletAccount: TypedRequestHandler<{
  request: {
    body: CreateWalletAccountRequestType;
  };
  response: {
    body:
      | CreateWalletAccount200Type
      | CreateWalletAccount400Type
      | CreateWalletAccount403Type
      | CreateWalletAccount500Type;
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
    } = await createWalletAccount({
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
      serverShare: JSON.stringify(serverShare),
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
