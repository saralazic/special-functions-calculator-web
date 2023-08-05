import { MathType } from 'mathjs';
import { FUNCTION_TYPE } from 'src/app/data/constants';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import { SpecialFunction } from '../specialFunction';

export class LaguerrePolynomial extends SpecialFunction {
  math = math_64;

  constructor() {
    super(FUNCTION_TYPE.LAGUERRE_POLYNOMIAL);
  }

  calculate(alpha: number, eps: number, x: number): number {
    let t = 1;
    let sum = t;

    let R: number;

    for (let k = 1; k <= alpha; k++) {
      R = (alpha - k + 1) / k ** 2;
      R = -R * x;
      t *= R;
      sum += t;
    }

    return sum;
  }

  calculateBig(alphaBig: string, eps: string, xBig: string): string {
    const alpha = this.math.bignumber(alphaBig);
    const x = this.math.bignumber(xBig);

    const alphaPlus1 = this.math.add(alpha, BIG_NUMBER_CONSTANTS.ONE);

    let t: MathType = this.math.bignumber(BIG_NUMBER_CONSTANTS.ONE);
    let sum: MathType = t;

    let R: MathType;
    let kBig: MathType;

    for (
      let k = 1;
      Number(this.math.compare(this.math.bignumber(k), alpha)) <= 0;
      k++
    ) {
      kBig = this.math.bignumber(k);
      R = this.math.subtract(alphaPlus1, k);
      R = this.math.divide(R, this.math.pow(kBig, BIG_NUMBER_CONSTANTS.TWO));
      R = this.math.multiply(R, x);
      R = this.math.unaryMinus(R);

      t = this.math.multiply(t, R);
      sum = this.math.add(sum, t);
    }

    return sum.toString();
  }
}
