export type ExportPrivateKeyRequestType = {
    /**
     * @type string
    */
    chainName: string;
    /**
     * @type string
    */
    accountAddress: string;
    /**
     * @type string | undefined
    */
    password?: string;
};