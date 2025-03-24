import { TransactionSerializable } from 'viem';
import { http, createWalletClient } from 'viem';
import { baseSepolia } from 'viem/chains';
import { parseEther } from 'viem/utils';
import {
  SignTransaction200Type,
  SignTransaction400Type,
  SignTransactionRequestType,
} from '../../../generated';
import { evmClient } from '../../../services/mpc/constants';
import { TypedRequestHandler } from '../../../types/express';

/**
 * /api/v1/actions/SignTransaction
 */

export const SignTransaction: TypedRequestHandler<{
  request: {
    body: SignTransactionRequestType;
  };
  response: {
    body: SignTransaction200Type | SignTransaction400Type;
    statusCode: 200 | 400;
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

  console.log('signing transaction');

  if (chainName === 'EVM') {
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
  } else {
    throw new Error('Unsupported chain');
  }
};
