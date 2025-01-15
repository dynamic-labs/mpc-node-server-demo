import { PartialEacType } from './PartialEacType';

export type ReshareRemainingPartyRequestType = {
  eac: PartialEacType;
  /**
   * @type string
   */
  roomId: string;
  /**
   * @type string
   */
  clientKeygenId: string;
  /**
   * @type string
   */
  clientBackupKeygenId: string;
};
