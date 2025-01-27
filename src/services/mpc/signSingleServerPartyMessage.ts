import { signMessage } from "@dynamic-labs-wallet/server";
import { EAC } from "types/credentials";

export const signSingleServerPartyMessage = async (
    message: string,
    roomId: string,
    serverEac: EAC,
  ) => {
    const { serverKeyShare, chain } = serverEac as EAC;
    await signMessage({
      message,
      chain,
      roomId,
      serverKeyShare: JSON.parse(serverKeyShare),
    });
  };