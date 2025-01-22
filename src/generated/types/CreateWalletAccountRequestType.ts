import { PartialEacType } from './PartialEacType';
import { ThresholdSignatureSchemeType } from './ThresholdSignatureSchemeType';

export type CreateWalletAccountRequestType = {
  eac: PartialEacType;
  /**
   * @type string
   */
  roomId: string;
  /**
   * @type array
   */
  clientKeygenIds: string[];
  thresholdSignatureScheme?: ThresholdSignatureSchemeType;
};
