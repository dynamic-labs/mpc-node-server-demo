export const exportType = {
  privateKey: 'privateKey',
  mnemonic: 'mnemonic',
} as const;
export type ExportTypeType = (typeof exportType)[keyof typeof exportType];
