import { ChainType } from './ChainType';
import { UuidType } from './UuidType';

export type EacType = {
  userId: UuidType;
  /**
   * @description Binary representation of the compressed public key (Uint8Array)
   * @type object | undefined
   */
  compressedPublicKey?: object;
  /**
   * @description Binary representation of the uncompressed public key (Uint8Array or EcdsaPublicKey)
   * @type object
   */
  uncompressedPublicKey: object;
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
