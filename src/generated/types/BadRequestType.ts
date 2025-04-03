export const badRequestErrorCode = {
    "bad_request": "bad_request"
} as const;
export type BadRequestErrorCodeType = (typeof badRequestErrorCode)[keyof typeof badRequestErrorCode];
export type BadRequestType = {
    /**
     * @type string | undefined
    */
    error_code?: BadRequestErrorCodeType;
    /**
     * @type string | undefined
    */
    error_message?: string;
};