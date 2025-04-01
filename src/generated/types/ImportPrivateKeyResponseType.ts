export type ImportPrivateKeyResponseType = {
    /**
     * @type string
    */
    accountAddress: string;
    /**
     * @type string | undefined
    */
    publicKeyHex?: string;
    /**
     * @type string
    */
    rawPublicKey: string;
    /**
     * @type string
    */
    externalServerKeyShares: string;
};