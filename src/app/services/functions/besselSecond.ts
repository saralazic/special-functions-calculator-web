import * as math from 'mathjs';
import { BigNumber } from 'mathjs';
import { math_64 } from 'src/utilities/big_numbers_math';
import { getPi } from '../../../utilities/utilities';
import { FunctionType } from '../../models/enums';
import {
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
  SpecialFunction,
} from './specialFunction';
import { BesselFirstKind } from './besselFirst';

//** TODO: Discuss this with professor and revisit, currently doesn't work */

export class BesselSecondKind extends SpecialFunction {
  math = math_64;
  J: BesselFirstKind;

  constructor() {
    super(FunctionType.BESSEL_SECOND_KIND);
    this.J = new BesselFirstKind();
  }

  calculate(params: FunctionParamsForCalculation): number {
    const { alpha, x } = params;
    const eps: number = params.eps ?? 10 ** -15;

    const Jalpha = this.J.calculate(params);
    let JminusAlpha = Jalpha;
    if (alpha % 2) JminusAlpha = -JminusAlpha;

    const limit = (expr: string, variable: string, value: number): number => {
      return (
        math.evaluate(expr, { [variable]: value + eps }) -
        math.evaluate(expr, { [variable]: value - eps })
      );
    };

    const val = limit(
      '(Math.cos(alpha * Math.PI) * Jalpha - JminusAlpha) / Math.sin(alpha * Math.PI)',
      'alpha',
      alpha
    );

    return val;
  }

  calculateBig(params: FunctionParamsForCalculationWithBigNumbers): string {
    const { alphaBig, xBig } = params;
    const epsBig = params.epsBig ?? '1e-64';

    const pi = getPi();
    const alpha = this.math.bignumber(alphaBig);
    const alphaPi = this.math.multiply(alpha, pi);

    const cos = this.math.cos(alphaPi as BigNumber);
    const sin = this.math.sin(alphaPi as BigNumber);

    const Jalpha = this.math.bignumber(this.J.calculateBig(params));

    let JminusAlpha = Jalpha;

    // JminusAlpha is (-1)^n Jalpha
    // if (alphaBig % 2 === 1) JminusAlpha = this.math.unaryMinus(JminusAlpha);

    let result = this.math.multiply(cos, Jalpha);
    result = this.math.subtract(result, JminusAlpha);
    result = this.math.divide(result, sin);

    return result.toString();
  }
}
