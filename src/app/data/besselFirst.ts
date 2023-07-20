import { FUNCTION_TYPE } from '../constants';
import { FunctionCharacteristics } from '../models/functionCharacteristics';

export const besselFunctionFirstKind: FunctionCharacteristics = {
  type: FUNCTION_TYPE.BESSEL_FIRST_KIND,
  condition: '2 alfa je vece od 0',
  domain: '???',
};
