import { EacType } from './EacType';

export type RefreshSharesRequestType = {
  eac: EacType;
  /**
   * @type string
   */
  roomId: string;
};
