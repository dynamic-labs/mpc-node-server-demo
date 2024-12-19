import { EncryptedEvervaultStringType } from './EncryptedEvervaultStringType';
import { PublicKeyType } from './PublicKeyType';
import { UuidType } from './UuidType';

export type CreateEmbeddedWalletResponseType = {
  ewc: EncryptedEvervaultStringType;
  eac: EncryptedEvervaultStringType;
  userId: UuidType;
  environmentId: UuidType;
  /**
   * @type string
   */
  accountAddress: string;
  uncompressedPublicKey: PublicKeyType;
  /**
   * @type string
   */
  compressedPublicKey: string;
};
