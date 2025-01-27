import { EacType } from './EacType';

export type ExportWalletAccountRequestType = {
  /**
   * @type array
   */
  serverEacs: EacType[];
  /**
   * @type string
   */
  exportId: string;
  /**
   * @type string
   */
  roomId: string;
};
