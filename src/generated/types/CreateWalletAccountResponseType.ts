export type CreateWalletAccountResponseType = {
  /**
   * @type string
   */
  rawPublicKey: string;
  /**
   * @type string
   */
  externalServerKeyShares: string;
  /**
   * @type string
   */
  accountAddress: string;
  /**
   * @type string | undefined
   */
  publicKeyHex?: string;
};
