import { BigNumber, MathType } from 'mathjs';
import { math_64 } from 'src/utilities/big_numbers_math';
import { FunctionType } from 'src/app/models/enums';
import {
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
  SpecialFunction,
} from './specialFunction';

export class ChebyshevPolynomialOfFirstKind extends SpecialFunction {
  math = math_64;

  constructor() {
    super(FunctionType.CHEBYSHEV_FIRST_KIND);
  }

  calculate(params: FunctionParamsForCalculation): number {
    const { alpha, x } = params;

    return Math.cos(alpha * Math.acos(x));
  }

  calculateBig(params: FunctionParamsForCalculationWithBigNumbers): string {
    const { alphaBig, xBig } = params;

    const alpha = this.math.bignumber(alphaBig);
    const x = this.math.bignumber(xBig);

    let result: MathType = this.math.acos(x);
    result = this.math.multiply(result, alpha);
    result = this.math.cos(result as BigNumber);

    return result.toString();
  }
}
