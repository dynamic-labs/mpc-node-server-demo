import { ChainType } from './ChainType';
import { UuidType } from './UuidType';

export type InitKeygenRequestType = {
  chain: ChainType;
  environmentId: UuidType;
  userId: UuidType;
  /**
   * @type number
   */
  parties: number;
};
