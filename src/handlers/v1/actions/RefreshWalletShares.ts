import {
  RefreshWalletShares200Type,
  RefreshWalletShares400Type,
  RefreshWalletShares403Type,
  RefreshWalletSharesRequestType,
} from '../../../generated';
import {
  authenticatedEvmClient,
  authenticatedSvmClient,
} from '../../../services/mpc/constants';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/RefreshWalletShares
 */

export const RefreshWalletShares: TypedRequestHandler<{
  request: {
    body: RefreshWalletSharesRequestType;
  };
  response: {
    body:
      | RefreshWalletShares200Type
      | RefreshWalletShares400Type
      | RefreshWalletShares403Type;
    statusCode: 200 | 400 | 403;
  };
}> = async (req, res) => {
  const { chainName, accountAddress, password } = req.body;
  const authToken = req.authToken;
  const environmentId = req.params.environmentId;
  if (!authToken) {
    return res.status(403).json({
      error_code: 'api_key_required',
      error_message: 'API key is required',
    });
  }
  if (chainName === 'EVM') {
    const evmClient = await authenticatedEvmClient({
      authToken,
      environmentId,
    });
    const refreshResults = await evmClient.refreshWalletAccountShares({
      accountAddress,
      chainName,
      password,
    });
    if (!refreshResults) {
      throw new Error('External server key shares not found');
    }
    return res.status(200).json({
      externalServerKeyShares: refreshResults,
    });
  } else if (chainName === 'SVM') {
    const svmClient = await authenticatedSvmClient({
      authToken,
      environmentId,
    });
    const refreshResults = await svmClient.refreshWalletAccountShares({
      accountAddress,
      chainName,
      password,
    });
    if (!refreshResults) {
      throw new Error('External server key shares not found');
    }
    return res.status(200).json({
      externalServerKeyShares: refreshResults,
    });
  } else {
    throw new Error('Unsupported chain');
  }
};
