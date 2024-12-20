import { ChainType } from './ChainType';

export type CreateRoomRequestType = {
  chain: ChainType;
  /**
   * @description The number of parties to create the room for
   * @type number
   */
  parties: number;
};
