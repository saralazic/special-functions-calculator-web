import { FUNCTION_TYPE } from '../../data/constants';
import {
  getPi,
  loadTranslationForFunction,
} from '../../../utilities/utilities';
import {
  ISpecialFunctionTranslations,
  SpecialFunction,
} from '../specialFunction';
import { math_64 } from 'src/utilities/big_numbers_math';
import { BigNumber } from 'mathjs';
import { BesselFirstKind } from './besselFirst';
import * as math from 'mathjs';

export class BesselSecondKind extends SpecialFunction {
  math = math_64;
  J: BesselFirstKind;

  constructor() {
    super();
    this.J = new BesselFirstKind();
  }

  calculate(alpha: number, eps: number, x: number): number {
    const Jalpha = this.J.calculate(alpha, eps, x);
    let JminusAlpha = Jalpha;
    if (alpha % 2) JminusAlpha = -JminusAlpha;

    const limit = (expr: string, variable: string, value: number): number => {
      // Compute the limit by evaluating the expression with a small delta around the value
      return (
        math.evaluate(expr, { [variable]: value + eps }) -
        math.evaluate(expr, { [variable]: value - eps })
      );
    };

    // Compute the limit using the custom function
    const val = limit(
      '(Math.cos(alpha * Math.PI) * Jalpha - JminusAlpha) / Math.sin(alpha * Math.PI)',
      'alpha',
      alpha
    );

    return val;
  }

  calculateBig(alphaBig: string, epsBig: string, xBig: string): string {
    const pi = getPi();
    const alpha = this.math.bignumber(alphaBig);
    const alphaPi = this.math.multiply(alpha, pi);

    const cos = this.math.cos(alphaPi as BigNumber);
    const sin = this.math.sin(alphaPi as BigNumber);

    const Jalpha = this.math.bignumber(
      this.J.calculateBig(alphaBig, epsBig, xBig)
    );
    console.log('J alpha: ' + Jalpha);

    let JminusAlpha = Jalpha;

    // JminusAlpha is (-1)^n Jalpha
    // if (alphaBig % 2 === 1) JminusAlpha = this.math.unaryMinus(JminusAlpha);

    console.log('J minus alpha: ' + JminusAlpha);

    let result = this.math.multiply(cos, Jalpha);
    result = this.math.subtract(result, JminusAlpha);
    result = this.math.divide(result, sin);

    return result.toString();
  }

  public loadTranslations(translations: any): ISpecialFunctionTranslations {
    const specialFunctionTranslation = loadTranslationForFunction(
      FUNCTION_TYPE.BESSEL_SECOND_KIND,
      translations
    );
    return {
      name: specialFunctionTranslation.name,
    };
  }
}
