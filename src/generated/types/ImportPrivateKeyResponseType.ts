import { ServerKeyShareType } from './ServerKeyShareType';
import { UuidType } from './UuidType';

export type ImportPrivateKeyResponseType = {
  userId: UuidType;
  environmentId: UuidType;
  /**
   * @type string
   */
  accountAddress: string;
  /**
   * @type string
   */
  uncompressedPublicKey: string;
  /**
   * @type string
   */
  compressedPublicKey: string;
  /**
   * @type array
   */
  serverKeyShares: ServerKeyShareType[];
};
