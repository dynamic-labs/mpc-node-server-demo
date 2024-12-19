export const forbiddenErrorCode = {
  jwt_invalid: 'jwt_invalid',
  jwt_not_authorized: 'jwt_not_authorized',
} as const;
export type ForbiddenErrorCodeType =
  (typeof forbiddenErrorCode)[keyof typeof forbiddenErrorCode];
export type ForbiddenType = {
  /**
   * @type string
   */
  error_code: ForbiddenErrorCodeType;
  /**
   * @type string
   */
  error_message: string;
};
