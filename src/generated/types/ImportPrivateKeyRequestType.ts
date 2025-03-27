export type ImportPrivateKeyRequestType = {
  /**
   * @type string
   */
  chainName: string;
  /**
   * @type string
   */
  privateKey: string;
  /**
   * @type string
   */
  accountAddress: string;
  /**
   * @type string | undefined
   */
  password?: string;
  /**
   * @type string
   */
  thresholdSignatureScheme: string;
};
