export const chain = {
  EVM: 'EVM',
  SOL: 'SOL',
  COSMOS: 'COSMOS',
  BTC: 'BTC',
  FLOW: 'FLOW',
  SUI: 'SUI',
} as const;
export type ChainType = (typeof chain)[keyof typeof chain];
