import { PartialEacType } from './PartialEacType';

export type CreateWalletAccountRequestType = {
  /**
   * @type array
   */
  serverEacs: PartialEacType[];
  /**
   * @type string
   */
  roomId: string;
  /**
   * @type array
   */
  clientKeygenIds: string[];
  /**
   * @type array
   */
  serverKeygenIds: string[];
  /**
   * @type string
   */
  thresholdSignatureScheme: string;
};
