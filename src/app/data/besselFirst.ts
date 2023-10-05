import { FunctionType } from '../models/enums';
import { FunctionCharacteristics } from '../models/functionCharacteristics';

export const besselFunctionFirstKind: FunctionCharacteristics = {
  type: FunctionType.BESSEL_FIRST_KIND,
  condition: '2 alfa je vece od 0',
  domain: '???',
};
