export type CreateRoomForReshareResponseType = {
  /**
   * @type string
   */
  roomId: string;
  /**
   * @type array
   */
  serverKeygenIds: string[];
  /**
   * @type array
   */
  serverEacs: string[];
  /**
   * @type array
   */
  newServerKeygenIds: string[];
  /**
   * @type array
   */
  newServerEacs: string[];
};
