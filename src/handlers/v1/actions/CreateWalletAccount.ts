// import { getMPCSigner } from '@dynamic-labs/dynamic-wallet-server';
import { createWalletAccount } from '@dynamic-labs/dynamic-wallet-server';
import {
  CreateWalletAccount200Type,
  CreateWalletAccount400Type,
  CreateWalletAccount403Type,
  CreateWalletAccount500Type,
  CreateWalletAccountRequestType,
} from '../../../generated';
import { evervaultEncrypt } from '../../../services/evervault';
// import { createWalletAccount } from '../../../services/wallets';
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
    const { eac, roomId, clientKeygenId, clientBackupKeygenId } = req.body;

    const { userId, serverKeygenInitResult, environmentId, chain } = eac;

    const {
      accountAddress,
      compressedPublicKey,
      uncompressedPublicKey,
      serverKeyShare,
    } = await createWalletAccount({
      chain,
      roomId,
      serverKeygenInitResult: JSON.parse(serverKeygenInitResult) as any,
      clientKeygenId,
      clientBackupKeygenId,
    });

    // const compressedPublicKeyHex = Buffer.from(
    //   compressedPublicKey ?? [],
    // ).toString('hex');
    // const uncompressedPublicKeyHex =
    //   uncompressedPublicKey instanceof Uint8Array
    //     ? Buffer.from(uncompressedPublicKey).toString('hex')
    //     : uncompressedPublicKey.pubKeyAsHex();

    // Encrypted Account Credential
    const rawEac: EAC = {
      userId,
      compressedPublicKey,
      uncompressedPublicKey,
      accountAddress,
      serverKeygenInitResult,
      environmentId,
      chain,
      serverKeyShare: JSON.stringify(serverKeyShare),
    };

    const modifiedEac = await evervaultEncrypt(JSON.stringify(rawEac));

    console.log({
      userId,
      environmentId,
      accountAddress: accountAddress as any,
      uncompressedPublicKey: uncompressedPublicKey.toString(),
      compressedPublicKey: compressedPublicKey?.toString(),
      eac: modifiedEac,
    });
    return res.status(200).json({
      userId,
      environmentId,
      accountAddress: accountAddress as any,
      uncompressedPublicKey: uncompressedPublicKey.toString(),
      compressedPublicKey: compressedPublicKey?.toString(),
      eac: modifiedEac,
    });
  } catch (error) {
    next(error);
  }
};
