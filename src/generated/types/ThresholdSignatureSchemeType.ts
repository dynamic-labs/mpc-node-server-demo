export const thresholdSignatureScheme = {
  TWO_OF_TWO: 'TWO_OF_TWO',
  TWO_OF_THREE: 'TWO_OF_THREE',
  THREE_OF_FIVE: 'THREE_OF_FIVE',
} as const;
export type ThresholdSignatureSchemeType =
  (typeof thresholdSignatureScheme)[keyof typeof thresholdSignatureScheme];
