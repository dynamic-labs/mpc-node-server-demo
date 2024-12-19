import { IssuerType } from './IssuerType';
import { UuidType } from './UuidType';

export type EwcType = {
  userId: UuidType;
  /**
   * @type string
   */
  mnemonic: string;
  /**
   * @type string
   */
  seed: string;
  environmentId: UuidType;
  jwtIssuer: IssuerType;
};
