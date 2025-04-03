import {
  GetWallets200Type,
  GetWallets400Type,
  GetWallets403Type,
  GetWalletsRequestType,
} from '../../../generated';
import {
  authenticatedEvmClient,
  authenticatedSvmClient,
} from '../../../services/mpc/constants';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/CreateWalletAccount
 */

export const GetWallets: TypedRequestHandler<{
  request: {
    body: GetWalletsRequestType;
  };
  response: {
    body: GetWallets200Type | GetWallets400Type | GetWallets403Type;
    statusCode: 200 | 400 | 403;
  };
}> = async (req, res) => {
  const { chainName } = req.body;
  const authToken = req.authToken;
  const environmentId = req.params.environmentId;
  console.log('--------------------------------authToken', authToken);
  console.log('--------------------------------environmentId', environmentId);
  if (!authToken) {
    const error = new Error('API key is required');
    Object.assign(error, {
      status: 403,
      code: 'api_key_required',
      message: 'API key is required',
    });
    throw error;
  }
  if (chainName === 'EVM') {
    const evmClient = await authenticatedEvmClient({
      authToken,
      environmentId,
    });
    const wallets = await evmClient.getEvmWallets();
    console.log('--------------------------------wallets', wallets);
    return res.status(200).json({
      wallets,
    });
  } else if (chainName === 'SVM') {
    const svmClient = await authenticatedSvmClient({
      authToken,
      environmentId,
    });
    const wallets = await svmClient.getSvmWallets();
    console.log('--------------------------------wallets', wallets);
    return res.status(200).json({
      wallets,
    });
  } else {
    throw new Error('Unsupported chain');
  }
};
