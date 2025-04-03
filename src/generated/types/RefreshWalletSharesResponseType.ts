export type RefreshWalletSharesResponseType = {
    /**
     * @type array
    */
    externalServerKeyShares: {
        /**
         * @type string
        */
        pubkey: string;
        /**
         * @type string
        */
        secretShare: string;
    }[];
};