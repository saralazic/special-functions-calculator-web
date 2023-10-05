import { FunctionType } from './enums';

export interface FunctionCharacteristics {
  type: FunctionType;
  condition: string; // have a new type
  domain: string; // as well
}
