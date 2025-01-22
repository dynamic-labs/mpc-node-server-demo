import { ChainType } from './ChainType';
import { EacType } from './EacType';
import { ThresholdSignatureSchemeType } from './ThresholdSignatureSchemeType';

export type CreateRoomRequestType = {
  chain: ChainType;
  thresholdSignatureScheme: ThresholdSignatureSchemeType;
  eac?: EacType;
};
