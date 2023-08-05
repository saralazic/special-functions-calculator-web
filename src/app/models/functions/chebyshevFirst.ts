import { BigNumber, MathType } from 'mathjs';
import { FUNCTION_TYPE } from 'src/app/data/constants';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import { SpecialFunction } from '../specialFunction';

export class ChebyshevPolynomialOfFirstKind extends SpecialFunction {
  math = math_64;

  constructor() {
    super(FUNCTION_TYPE.CHEBYSHEV_FIRST_KIND);
  }

  calculate(alpha: number, eps: number, x: number): number {
    return Math.cos(alpha * Math.acos(x));
  }

  calculateBig(alphaBig: string, eps: string, xBig: string): string {
    const alpha = this.math.bignumber(alphaBig);
    const x = this.math.bignumber(xBig);

    let result: MathType = this.math.acos(x);
    result = this.math.multiply(result, alpha);
    result = this.math.cos(result as BigNumber);

    return result.toString();
  }
}
