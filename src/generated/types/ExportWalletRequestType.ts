import { EacType } from './EacType';
import { EwcType } from './EwcType';
import { ExportTypeType } from './ExportTypeType';
import { JwtType } from './JwtType';
import { UuidType } from './UuidType';

export type ExportWalletRequestType = {
  jwt: JwtType;
  /**
   * @type string
   */
  publicKey: string;
  exportType?: ExportTypeType;
  environmentId?: UuidType;
  dynamicUserId?: UuidType;
  ewc?: EwcType;
  eac?: EacType;
};
