import { ChainType } from './ChainType';
import { EacType } from './EacType';
import { ThresholdSignatureSchemeType } from './ThresholdSignatureSchemeType';

export const createRoomRequestParties = {
  threshold: 'threshold',
  full: 'full',
} as const;
export type CreateRoomRequestPartiesType =
  (typeof createRoomRequestParties)[keyof typeof createRoomRequestParties];
export type CreateRoomRequestType = {
  chain: ChainType;
  thresholdSignatureScheme: ThresholdSignatureSchemeType;
  /**
   * @type array | undefined
   */
  serverEacs?: EacType[];
  /**
   * @type string | undefined
   */
  parties?: CreateRoomRequestPartiesType;
};
