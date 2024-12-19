import { CreateEmbeddedWalletOptionsType } from './CreateEmbeddedWalletOptionsType';
import { IssuerType } from './IssuerType';
import { UuidType } from './UuidType';

export type CreateEmbeddedWalletRequestType = {
  options: CreateEmbeddedWalletOptionsType;
  environmentId: UuidType;
  userId: UuidType;
  jwtIssuer: IssuerType;
};
