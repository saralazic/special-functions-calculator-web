import * as math from 'mathjs';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import { FunctionType } from '../../models/enums';
import { gamma64 } from '../../../utilities/utilities';
import {
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
  SpecialFunction,
} from './specialFunction';

export class GammaFunction extends SpecialFunction {
  constructor() {
    super(FunctionType.GAMA);
  }

  calculate(params: FunctionParamsForCalculation): number {
    const { alpha, x } = params;

    return 0;

    // console.log('x: ' + x);
    // console.log('alpha: ' + alpha);
  }

  calculate64(params: FunctionParamsForCalculationWithBigNumbers): string {
    const { x, alpha, eps } = this.stringToBigNumber(params);

    return '';
  }
}
