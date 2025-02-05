import { PartialEacType } from './PartialEacType';
import { ThresholdSignatureSchemeType } from './ThresholdSignatureSchemeType';

export type ImportPrivateKeyRequestType = {
  /**
   * @type array
   */
  serverEacs: PartialEacType[];
  /**
   * @type string
   */
  roomId: string;
  thresholdSignatureScheme: ThresholdSignatureSchemeType;
  /**
   * @type array
   */
  clientKeygenIds: string[];
};
