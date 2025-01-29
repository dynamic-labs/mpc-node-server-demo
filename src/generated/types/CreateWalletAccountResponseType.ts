import { ServerKeyShareType } from './ServerKeyShareType';
import { UuidType } from './UuidType';

export type CreateWalletAccountResponseType = {
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
   * @type string
   */
  derivationPath: string;
  /**
   * @type array
   */
  serverKeyShares: ServerKeyShareType[];
};
