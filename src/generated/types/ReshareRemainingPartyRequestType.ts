import { PartialEacType } from './PartialEacType';

export type ReshareRemainingPartyRequestType = {
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
