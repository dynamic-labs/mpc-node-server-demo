import { EacType } from './EacType';
import { ThresholdSignatureSchemeType } from './ThresholdSignatureSchemeType';

export type CreateRoomForReshareRequestType = {
  /**
   * @type array | undefined
   */
  serverEacs?: EacType[];
  newThresholdSignatureScheme: ThresholdSignatureSchemeType;
  oldThresholdSignatureScheme: ThresholdSignatureSchemeType;
};
