import { EacType } from './EacType';
import { JwtType } from './JwtType';

export type SignMessageRequestType = {
  jwt?: JwtType;
  /**
   * @type string
   */
  message: string;
  /**
   * @type string
   */
  roomId: string;
  eac: EacType;
};
