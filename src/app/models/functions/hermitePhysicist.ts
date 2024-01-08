import * as math from 'mathjs';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import { FunctionType } from '../enums';
import {
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
  SpecialFunction,
} from './specialFunction';
import { factorial } from 'mathjs';

export class HermitePhysicist extends SpecialFunction {
  math = math_64;

  constructor() {
    super(FunctionType.HERMITE_PHYSICIST);
  }

  calculate(params: FunctionParamsForCalculation): number {
    const { alpha, x } = params;

    const alphaFactorial = factorial(alpha);

    let t = ((2 * x) ^ alpha) / alphaFactorial;
    let sum = t;

    let R: number;

    const c = -(2 * x) ^ -2;

    for (let k = 1; 2 * k <= alpha; k++) {
      R = (c * (alpha - 2 * k + 1) * (alpha - 2 * k + 2)) / k;
      t *= R;
      sum += t;
    }

    return alphaFactorial * sum;
  }

  calculateBig(params: FunctionParamsForCalculationWithBigNumbers): string {
    const { alphaBig, xBig } = params;

    const alpha = this.math.bignumber(alphaBig);
    const x = this.math.bignumber(xBig);

    const alphaFactorial = this.math.factorial(alpha);

    const x2 = this.math.multiply(BIG_NUMBER_CONSTANTS.TWO, x);

    let t = this.math.pow(x2, alpha);
    t = this.math.divide(t, alphaFactorial);

    let sum = t;

    let R;

    let c = this.math.pow(x2, this.math.unaryMinus(BIG_NUMBER_CONSTANTS.TWO));
    c = this.math.unaryMinus(c);

    for (
      let k = 1;
      Number(this.math.compare(this.math.multiply(2, k), alpha)) <= 0;
      k++
    ) {
      //  R = (c * (alpha - 2 * k + 1) * (alpha - 2 * k + 2)) / k;
      let m = this.math.subtract(
        this.math.add(alpha, BIG_NUMBER_CONSTANTS.ONE),
        this.math.multiply(2, k)
      );

      R = this.math.multiply(m, this.math.add(m, BIG_NUMBER_CONSTANTS.ONE));
      R = this.math.multiply(R, c);
      R = this.math.divide(R, k);

      t = this.math.multiply(R, t);
      sum = this.math.add(t, sum);
    }

    return sum.toString();
  }
}
