import { ChainType } from './ChainType';
import { ThresholdSignatureSchemeType } from './ThresholdSignatureSchemeType';
import { UuidType } from './UuidType';

export type InitKeygenRequestType = {
  chain: ChainType;
  environmentId: UuidType;
  userId: UuidType;
  thresholdSignatureScheme: ThresholdSignatureSchemeType;
};
