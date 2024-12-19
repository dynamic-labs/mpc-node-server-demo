import { EncryptedEvervaultStringType } from './EncryptedEvervaultStringType';

export type InitKeygenResponseType = {
  eac?: EncryptedEvervaultStringType;
  /**
   * @type string
   */
  roomId: string;
  /**
   * @type string | undefined
   */
  serverKeygenId?: string;
};
