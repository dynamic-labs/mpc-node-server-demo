import { ChainType } from './ChainType';
import { MnemonicLengthType } from './MnemonicLengthType';

export type CreateEmbeddedWalletOptionsType = {
  chain: ChainType;
  /**
   * @type string | undefined
   */
  path?: string;
  mnemonicLength?: MnemonicLengthType;
};
