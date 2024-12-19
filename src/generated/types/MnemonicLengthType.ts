export const mnemonicLength = {
  '12': 12,
  '15': 15,
  '18': 18,
  '21': 21,
  '24': 24,
} as const;
export type MnemonicLengthType =
  (typeof mnemonicLength)[keyof typeof mnemonicLength];
