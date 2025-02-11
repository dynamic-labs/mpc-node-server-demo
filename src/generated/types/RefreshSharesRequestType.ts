import { EacType } from './EacType';

export type RefreshSharesRequestType = {
  /**
   * @type array
   */
  serverEacs: EacType[];
  /**
   * @type string
   */
  roomId: string;
};
