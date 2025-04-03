export type GetWalletsResponseType = {
    /**
     * @type array
    */
    wallets: {
        /**
         * @type string
        */
        walletId: string;
        /**
         * @type string
        */
        chainName: string;
        /**
         * @type string
        */
        accountAddress: string;
        /**
         * @type object | undefined
        */
        serverKeySharesBackupInfo?: {
            [key: string]: any;
        };
        /**
         * @type array | undefined
        */
        externalServerKeyShares?: string[];
        /**
         * @type string
        */
        derivationPath?: string | null;
        /**
         * @type string
        */
        thresholdSignatureScheme?: string | null;
    }[];
};