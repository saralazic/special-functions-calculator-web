import { FUNCTION_TYPE } from '../../data/constants';
import {
  factorial,
  loadTranslationForFunction,
} from '../../../utilities/utilities';
import {
  ISpecialFunctionTranslations,
  SpecialFunction,
} from '../specialFunction';
import { MathType } from 'mathjs';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';

export class BesselFirstKind extends SpecialFunction {
  math = math_64;

  calculate(n: number, eps: number, x: number): number {
    let t = 1 / factorial(n);
    let sum = t;

    for (let k = 1; Math.abs(t / sum) > eps; k++) {
      const R = -(x ** 2) / (4 * k * (n + k));
      t *= R;
      sum += t;
    }

    return sum * (x / 2) ** n;
  }

  calculateBig(n: number, epsBig: string, xBig: string): string {
    const eps = this.math.bignumber(epsBig);
    const x = this.math.bignumber(xBig);

    const nBig = this.math.bignumber(n);

    const fact = this.math.factorial(n);
    let t: MathType = this.math.divide(BIG_NUMBER_CONSTANTS.ONE, fact);

    let sum: MathType = t;

    const xsqr = this.math.pow(x, BIG_NUMBER_CONSTANTS.TWO);
    const numerator = this.math.unaryMinus(xsqr);

    for (
      let k = 1;
      Number(this.math.compare(this.math.abs(this.math.divide(t, sum)), eps)) >
      0;
      k++
    ) {
      const kBig = this.math.bignumber(k);

      let denominator: MathType = this.math.add(nBig, kBig);
      denominator = this.math.multiply(denominator, kBig);
      denominator = this.math.multiply(denominator, BIG_NUMBER_CONSTANTS.FOUR);

      const R = this.math.divide(numerator, denominator);
      t = this.math.multiply(t, R);
      sum = this.math.add(sum, t);
    }

    let result = this.math.divide(x, BIG_NUMBER_CONSTANTS.TWO);
    result = this.math.pow(result, nBig);
    result = this.math.multiply(sum, result);

    return result.toString();
  }

  public loadTranslations(translations: any): ISpecialFunctionTranslations {
    const specialFunctionTranslation = loadTranslationForFunction(
      FUNCTION_TYPE.BESSEL_FIRST_KIND,
      translations
    );
    return {
      name: specialFunctionTranslation.name,
    };
  }
}
