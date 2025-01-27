import { exportWalletAccount } from "@dynamic-labs-wallet/server";
import { EAC } from "types/credentials";

export const exportSingleServerPartyWalletAccount = async (
    exportId: string,
    roomId: string,
    serverEac: EAC,
  ) => {
    const { chain, serverKeyShare } = serverEac;
    const exportedKey = await exportWalletAccount({
      chain,
      roomId,
      serverKeyShare: JSON.parse(serverKeyShare),
      exportId,
    });
    return exportedKey;
  };
  