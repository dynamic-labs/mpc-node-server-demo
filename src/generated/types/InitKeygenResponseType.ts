import { EncryptedEvervaultStringType } from './EncryptedEvervaultStringType';

export type InitKeygenResponseType = {
  /**
   * @type string
   */
  roomId: string;
  /**
   * @type array
   */
  serverKeygenIds: string[];
  /**
   * @type array
   */
  serverEacs: EncryptedEvervaultStringType[];
};
