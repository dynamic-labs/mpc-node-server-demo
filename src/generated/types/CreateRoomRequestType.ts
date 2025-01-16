import { ChainType } from './ChainType';
import { EacType } from './EacType';

export type CreateRoomRequestType = {
  chain: ChainType;
  /**
   * @description The number of parties to create the room for
   * @type number
   */
  parties: number;
  eac?: EacType;
};
