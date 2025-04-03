export type SignTransactionRequestType = {
    /**
     * @type string
    */
    chainName: string;
    /**
     * @type string
    */
    sendToAddress: string;
    /**
     * @type string
    */
    senderAddress: string;
    /**
     * @type string
    */
    amount: string;
    /**
     * @type string | undefined
    */
    password?: string;
    /**
     * @type boolean
    */
    sendRawTransaction: boolean;
};