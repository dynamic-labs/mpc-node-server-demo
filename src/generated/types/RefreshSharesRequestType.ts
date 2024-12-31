import { PartialEacType } from './PartialEacType';

export type RefreshSharesRequestType = {
  eac: PartialEacType;
  /**
   * @type string
   */
  roomId: string;
};
