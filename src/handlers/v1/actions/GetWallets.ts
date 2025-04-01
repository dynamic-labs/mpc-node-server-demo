import {
  GetWallets200Type,
  GetWallets400Type,
  GetWallets403Type,
  GetWalletsRequestType,
} from '../../../generated';
import {
  authenticatedEvmClient,
  authenticatedSvmClient,
  evmClient,
  svmClient,
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
    await authenticatedEvmClient(authToken);
    const wallets = await evmClient.getEvmWallets();
    return res.status(200).json(wallets);
  } else if (chainName === 'SVM') {
    await authenticatedSvmClient(authToken);
    const wallets = await svmClient.getSvmWallets();
    return res.status(200).json(wallets);
  } else {
    throw new Error('Unsupported chain');
  }
};
