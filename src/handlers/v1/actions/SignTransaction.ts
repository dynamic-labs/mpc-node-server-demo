import { TransactionSerializable } from 'viem';
import { http, createWalletClient } from 'viem';
import { baseSepolia } from 'viem/chains';
import { parseEther } from 'viem/utils';
import {
  SignTransaction200Type,
  SignTransaction400Type,
  SignTransaction403Type,
  SignTransaction500Type,
  SignTransactionRequestType,
} from '../../../generated';
import { authenticatedEvmClient } from '../../../services/mpc/constants';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/SignTransaction
 */

export const SignTransaction: TypedRequestHandler<{
  request: {
    body: SignTransactionRequestType;
  };
  response: {
    body:
      | SignTransaction200Type
      | SignTransaction400Type
      | SignTransaction403Type
      | SignTransaction500Type;
    statusCode: 200 | 400 | 403 | 500;
  };
}> = async (req, res) => {
  const {
    chainName,
    sendToAddress,
    senderAddress,
    amount,
    password,
    sendRawTransaction,
  } = req.body;

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
    try {
      const chain = baseSepolia;
      const publicClient = evmClient.createViemPublicClient({
        chain: baseSepolia,
        rpcUrl: 'https://sepolia.base.org',
      });

      const transactionRequest = {
        to: sendToAddress as `0x${string}`,
        value: parseEther(amount),
      };

      const tx = await publicClient?.prepareTransactionRequest({
        ...transactionRequest,
        chain,
        account: senderAddress as `0x${string}`,
      });

      const signedTx = await evmClient.signTransaction({
        senderAddress: senderAddress,
        transaction: tx as TransactionSerializable,
        password,
      });

      const walletClient = createWalletClient({
        chain,
        transport: http('https://sepolia.base.org'),
        account: senderAddress as `0x${string}`,
      });

      if (sendRawTransaction) {
        const txHash = await walletClient.sendRawTransaction({
          serializedTransaction: signedTx as any,
        });
        return res.status(200).json({
          txHash,
          blockExplorerUrl: `https://sepolia.basescan.org/tx/${txHash}`,
        });
      }

      if (!signedTx) {
        console.error('Error signing transaction');
        return;
      }
      return res.status(200).json({
        signedTx,
      });
    } catch (error) {
      console.error('Error signing transaction', error);
      return res.status(500).json({
        error_code: 'internal_server_error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else {
    throw new Error('Unsupported chain');
  }
};
