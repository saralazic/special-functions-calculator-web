import { FUNCTION_TYPE } from '../constants';

export interface FunctionCharacteristics {
  type: FUNCTION_TYPE;
  condition: string; // have a new type
  domain: string; // as well
}
