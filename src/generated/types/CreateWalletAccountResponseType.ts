import { ExternalServerKeySharesType } from "./ExternalServerKeySharesType";

 export type CreateWalletAccountResponseType = {
    /**
     * @description Raw public key as a Uint8Array
     * @type array
    */
    rawPublicKey: number[];
    externalServerKeyShares: ExternalServerKeySharesType;
    /**
     * @type string
    */
    accountAddress: string;
    /**
     * @type string | undefined
    */
    publicKeyHex?: string;
};