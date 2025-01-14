import { EncryptedEvervaultStringType } from './EncryptedEvervaultStringType';
import { UuidType } from './UuidType';

export type ImportPrivateKeyResponseType = {
  eac: EncryptedEvervaultStringType;
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
   * @type string | undefined
   */
  compressedPublicKey?: string;
};
