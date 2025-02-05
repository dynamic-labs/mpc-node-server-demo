import { EncryptedEvervaultStringType } from './EncryptedEvervaultStringType';

export type ServerKeyShareType = {
  /**
   * @type string | undefined
   */
  serverKeygenId?: string;
  serverEac?: EncryptedEvervaultStringType;
};
