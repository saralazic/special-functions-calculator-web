import { MathType } from 'mathjs';
import { FUNCTION_TYPE } from 'src/app/data/constants';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import {
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
  SpecialFunction,
} from '../specialFunction';

export class LegendrePolynomial extends SpecialFunction {
  math = math_64;

  constructor() {
    super(FUNCTION_TYPE.LEGENDRE_POLYNOMIAL);
  }

  calculate(params: FunctionParamsForCalculation): number {
    const { alpha, x } = params;

    let t: number = (x - 1) ** alpha;
    let sum = t;

    const Rx = (x + 1) / (x - 1);
    let R: number;

    for (let k = 1; k <= alpha; k++) {
      R = ((alpha - k + 1) / k) ** 2;
      R *= Rx;
      t *= R;
      sum += t;
    }

    let res = 2 ** -alpha;
    res *= sum;

    return res;
  }

  calculateBig(params: FunctionParamsForCalculationWithBigNumbers): string {
    const { alphaBig, xBig } = params;

    const alpha = this.math.bignumber(alphaBig);
    const x = this.math.bignumber(xBig);

    const xMinus1 = this.math.subtract(x, BIG_NUMBER_CONSTANTS.ONE);
    const xPlus1 = this.math.add(x, BIG_NUMBER_CONSTANTS.ONE);

    let t = this.math.pow(xMinus1, alpha);
    let sum = t;

    const Rx = this.math.divide(xPlus1, xMinus1);
    let R: MathType;

    for (
      let k = 1;
      Number(this.math.compare(this.math.bignumber(k), alpha)) <= 0;
      k++
    ) {
      const kBig = this.math.bignumber(k);
      R = this.math.subtract(alpha, kBig);
      R = this.math.add(R, BIG_NUMBER_CONSTANTS.ONE);
      R = this.math.divide(R, kBig);
      R = this.math.pow(R, BIG_NUMBER_CONSTANTS.TWO);
      R = this.math.multiply(R, Rx);
      t = this.math.multiply(t, R);
      sum = this.math.add(sum, t);
    }

    let res = this.math.pow(
      BIG_NUMBER_CONSTANTS.TWO,
      this.math.unaryMinus(alpha)
    );
    res = this.math.multiply(res, sum);

    return res.toString();
  }
}
