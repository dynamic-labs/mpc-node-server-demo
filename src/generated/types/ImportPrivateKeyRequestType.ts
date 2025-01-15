import { PartialEacType } from './PartialEacType';

export type ImportPrivateKeyRequestType = {
  eac: PartialEacType;
  /**
   * @type string
   */
  roomId: string;
  /**
   * @type string
   */
  clientPrimaryKeygenId: string;
  /**
   * @type string
   */
  clientSecondaryKeygenId: string;
};
