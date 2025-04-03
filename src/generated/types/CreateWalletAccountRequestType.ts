import { ThresholdSignatureSchemeType } from "./ThresholdSignatureSchemeType";

 export type CreateWalletAccountRequestType = {
    /**
     * @type string
    */
    chainName: string;
    thresholdSignatureScheme: ThresholdSignatureSchemeType;
    /**
     * @type string | undefined
    */
    password?: string;
};