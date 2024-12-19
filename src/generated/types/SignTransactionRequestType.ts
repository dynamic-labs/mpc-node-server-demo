import { EacType } from './EacType';
import { JwtType } from './JwtType';

export type SignTransactionRequestType = {
  jwt: JwtType;
  /**
   * @type string
   */
  transaction: string;
  eac?: EacType;
};
