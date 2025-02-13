import { EAC } from '../../types/credentials';
import { mpcClient } from './constants';

export const exportSingleServerPartyWalletAccount = async (
  exportId: string,
  roomId: string,
  serverEac: EAC,
) => {
  const { chain, serverKeyShare } = serverEac;
  const exportedKey = await mpcClient.exportWalletAccount({
    chain,
    roomId,
    serverKeyShare: JSON.parse(serverKeyShare),
    exportId,
  });
  return exportedKey;
};
