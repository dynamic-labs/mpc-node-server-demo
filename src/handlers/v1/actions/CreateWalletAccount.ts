// import { getMPCSigner } from '@dynamic-labs/dynamic-wallet-server';
import {
  ThresholdSignatureScheme,
  createWalletAccount,
} from '@dynamic-labs/dynamic-wallet-server';
import {
  CreateWalletAccount200Type,
  CreateWalletAccount400Type,
  CreateWalletAccount403Type,
  CreateWalletAccount500Type,
  CreateWalletAccountRequestType,
} from '../../../generated';
import { evervaultEncrypt } from '../../../services/evervault';
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
    const { eac, roomId, clientKeygenIds, thresholdSignatureScheme } = req.body;

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
      clientKeygenIds,
      thresholdSignatureScheme:
        thresholdSignatureScheme as ThresholdSignatureScheme,
    });

    // Encrypted Account Credential
    const rawEac: EAC = {
      userId,
      compressedPublicKey,
      uncompressedPublicKey,
      accountAddress,
      serverKeygenInitResult,
      serverKeyShare: JSON.stringify(serverKeyShare),
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
      serverKeyShare: JSON.stringify(serverKeyShare),
    });
    return res.status(200).json({
      userId,
      environmentId,
      accountAddress: accountAddress as any,
      uncompressedPublicKey: uncompressedPublicKey,
      compressedPublicKey: compressedPublicKey,
      // serverKeyShares: [{
      //   eac: modifiedEac,
      //   serverKeygenId: serverKeygenInitResult.keygenId,
      // }],
      eac: modifiedEac,
    });
  } catch (error) {
    next(error);
  }
};
