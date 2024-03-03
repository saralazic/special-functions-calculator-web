import * as math from 'mathjs';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import { FunctionType } from '../../models/enums';
import { gamma64 } from '../../../utilities/utilities';
import {
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
  SpecialFunction,
} from './specialFunction';
import { BigNumber } from 'mathjs';

export class GammaFunction extends SpecialFunction {
  constructor() {
    super(FunctionType.GAMA);
  }

  calculate(params: FunctionParamsForCalculation): number {
    const { x } = params;
    return 0;

    // console.log('x: ' + x);
    // console.log('alpha: ' + alpha);
  }

  calculate64(params: FunctionParamsForCalculationWithBigNumbers): string {
    const { x, eps } = this.stringToBigNumber(params);

    if (this.math.isInteger(x)) this.naturalFactorial(x).toString();

    return '';
  }

  private naturalFactorial(n: BigNumber): BigNumber {
    if (n.equals(BIG_NUMBER_CONSTANTS.ZERO)) return BIG_NUMBER_CONSTANTS.ONE;
    const nMinus1 = this.math.subtract(n, 1);
    const fprev = this.naturalFactorial(nMinus1 as BigNumber);
    return this.math.multiply(nMinus1, fprev) as BigNumber;
  }

  private coefficientAk(k: BigNumber, r: BigNumber) {}
}
