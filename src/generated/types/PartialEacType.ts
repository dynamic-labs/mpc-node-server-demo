import { ChainType } from './ChainType';
import { UuidType } from './UuidType';

export type PartialEacType = {
  userId: UuidType;
  environmentId: UuidType;
  /**
   * @type string
   */
  serverKeygenInitResult: string;
  chain: ChainType;
};
