export const internalServerErrorErrorCode = {
  internal_server_error: 'internal_server_error',
  turnkey_api_error: 'turnkey_api_error',
} as const;
export type InternalServerErrorErrorCodeType =
  (typeof internalServerErrorErrorCode)[keyof typeof internalServerErrorErrorCode];
export type InternalServerErrorType = {
  /**
   * @type string | undefined
   */
  error_code?: InternalServerErrorErrorCodeType;
  /**
   * @type string | undefined
   */
  error_message?: string;
};
