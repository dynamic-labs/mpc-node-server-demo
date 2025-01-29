import { EacType } from './EacType';
import { ThresholdSignatureSchemeType } from './ThresholdSignatureSchemeType';

export type ImportPrivateKeyRequestType = {
  /**
   * @type array
   */
  serverEacs: EacType[];
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
