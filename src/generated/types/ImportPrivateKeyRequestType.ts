import { EacType } from './EacType';

export type ImportPrivateKeyRequestType = {
  /**
   * @type array
   */
  serverEacs: EacType[];
  /**
   * @type string
   */
  roomId: string;
  /**
   * @type array
   */
  clientKeygenIds: string[];
};
