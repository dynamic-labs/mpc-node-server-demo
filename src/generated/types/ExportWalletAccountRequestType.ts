import { EacType } from './EacType';

export type ExportWalletAccountRequestType = {
  eac: EacType;
  /**
   * @type string
   */
  exportId: string;
  /**
   * @type string
   */
  roomId: string;
};
