import { PartialEacType } from './PartialEacType';
import { ThresholdSignatureSchemeType } from './ThresholdSignatureSchemeType';

export type ReshareRequestType = {
  /**
   * @type string
   */
  roomId: string;
  /**
   * @type array
   */
  allPartyKeygenIds: string[];
  /**
   * @type array
   */
  serverEacs: PartialEacType[];
  /**
   * @type array
   */
  newServerEacs: PartialEacType[];
  oldThresholdSignatureScheme: ThresholdSignatureSchemeType;
  newThresholdSignatureScheme: ThresholdSignatureSchemeType;
};
