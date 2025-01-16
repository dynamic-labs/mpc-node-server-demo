import { ChainType } from './ChainType';

export type CreateRoomRequestType = {
  chain: ChainType;
  /**
   * @type number
   */
  parties: number;
};
