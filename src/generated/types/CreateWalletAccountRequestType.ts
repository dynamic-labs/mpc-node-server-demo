import { PartialEacType } from './PartialEacType';
import { ThresholdSignatureSchemeType } from './ThresholdSignatureSchemeType';

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
  thresholdSignatureScheme: ThresholdSignatureSchemeType;
};
