export const forbiddenErrorCode = {
    "api_key_required": "api_key_required",
    "api_key_invalid": "api_key_invalid",
    "api_key_not_authorized": "api_key_not_authorized"
} as const;
export type ForbiddenErrorCodeType = (typeof forbiddenErrorCode)[keyof typeof forbiddenErrorCode];
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