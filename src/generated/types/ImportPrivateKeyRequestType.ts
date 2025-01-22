import { PartialEacType } from './PartialEacType';

export type ImportPrivateKeyRequestType = {
  eac: PartialEacType;
  /**
   * @type string
   */
  roomId: string;
  /**
   * @type array
   */
  clientKeygenIds: string[];
};
