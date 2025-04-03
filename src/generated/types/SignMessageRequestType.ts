export type SignMessageRequestType = {
  /**
   * @type string
   */
  chainName: string;
  /**
   * @type string
   */
  message: string;
  /**
   * @type string
   */
  accountAddress: string;
  /**
   * @type string | undefined
   */
  password?: string;
};
