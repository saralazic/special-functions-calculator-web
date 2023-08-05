import { MathType } from 'mathjs';
import { FUNCTION_TYPE } from 'src/app/data/constants';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import {
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
  SpecialFunction,
} from '../specialFunction';

export class JacobiPolynomial extends SpecialFunction {
  math = math_64;

  constructor() {
    super(FUNCTION_TYPE.JACOBI_POLYNOMIAL);
  }

  calculate(params: FunctionParamsForCalculation): number {
    const { alpha, x } = params;
    const a = params.a ?? 0;
    const b = params.b ?? 0;

    let t = (x - 1) ** alpha;
    let sum = t;
    let p;
    let R;

    for (let k = 0; k <= alpha; k++) {
      p = alpha - k + 1;
      R = p * (p + a);
      R /= k * (k + b);
      R *= (x + 1) / (x - 1);
      t *= R;
      sum += t;
    }

    return sum / 2 ** alpha;
  }

  calculateBig(params: FunctionParamsForCalculationWithBigNumbers): string {
    const { alphaBig, xBig } = params;

    const alpha = this.math.bignumber(alphaBig);
    const x = this.math.bignumber(xBig);
    const a = this.math.bignumber(params.a ?? '0');
    const b = this.math.bignumber(params.b ?? '0');

    const xPlus1 = this.math.add(x, BIG_NUMBER_CONSTANTS.ONE);
    const xMinus1 = this.math.subtract(x, BIG_NUMBER_CONSTANTS.ONE);

    const alphaPlus1 = this.math.add(alpha, BIG_NUMBER_CONSTANTS.ONE);

    let t: MathType = this.math.subtract(x, BIG_NUMBER_CONSTANTS.ONE);
    t = this.math.pow(t, alpha);
    let sum = t;

    let p, R, kBig: MathType;

    for (
      let k = 1;
      Number(this.math.compare(this.math.bignumber(k), alpha)) <= 0;
      k++
    ) {
      kBig = this.math.bignumber(k);
      p = this.math.subtract(alphaPlus1, kBig);

      R = this.math.add(p, a);
      R = this.math.multiply(R, p);
      R = this.math.divide(R, kBig);
      R = this.math.divide(R, this.math.subtract(kBig, b));
      R = this.math.multiply(R, xPlus1);
      R = this.math.divide(R, xMinus1);

      t = this.math.multiply(t, R);
      sum = this.math.add(sum, t);
    }

    const res = this.math.divide(
      sum,
      this.math.pow(BIG_NUMBER_CONSTANTS.TWO, alpha)
    );

    return res.toString();
  }
}
