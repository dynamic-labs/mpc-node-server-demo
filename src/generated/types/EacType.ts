import { ChainType } from './ChainType';
import { UuidType } from './UuidType';

export type EacType = {
  userId: UuidType;
  /**
   * @type string | undefined
   */
  compressedPublicKey?: string;
  /**
   * @type string
   */
  uncompressedPublicKey: string;
  /**
   * @type string
   */
  accountAddress: string;
  environmentId: UuidType;
  /**
   * @type string
   */
  serverKeygenInitResult: string;
  chain: ChainType;
};
