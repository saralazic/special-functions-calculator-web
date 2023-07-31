import { FUNCTION_TYPE } from '../../data/constants';
import {
  factorial,
  loadTranslationForFunction,
} from '../../../utilities/utilities';
import {
  ISpecialFunctionTranslations,
  SpecialFunction,
} from '../specialFunction';
import * as math from 'mathjs';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';

export class BesselFirstKind extends SpecialFunction {
  math = math_64;

  calculate(alpha: number, eps: number, x: number): number {
    const xHalf = x / 2.0;
    const xHalfSqr = xHalf ** 2;

    let gammaArg = alpha + 1.0;
    let gammaCurrent: number = math.gamma(gammaArg);

    let t = xHalf ** alpha / gammaCurrent;
    let sum = t;

    let gammaPrevious: number;
    let R: number;

    for (let m = 1; math.abs(t / sum) > eps; m++) {
      gammaPrevious = gammaCurrent;

      gammaArg += 1;
      gammaCurrent = math.gamma(gammaArg);

      R = -(xHalfSqr * gammaPrevious) / (m * gammaCurrent);
      t *= R;
      sum += t;
    }

    return sum;
  }

  calculateBig(alphaBig: number, epsBig: string, xBig: string): string {
    const alpha = this.math.bignumber(alphaBig);
    const eps = this.math.bignumber(epsBig);
    const x = this.math.bignumber(xBig);

    let alphaPlusOne = this.math.add(alpha, BIG_NUMBER_CONSTANTS.ONE);
    let gammaCurrent = this.math.gamma(alphaPlusOne);

    const xHalf = this.math.divide(x, BIG_NUMBER_CONSTANTS.TWO);
    const xHalfSqr = this.math.pow(xHalf, BIG_NUMBER_CONSTANTS.TWO);

    const xHalfPowered = this.math.pow(xHalf, alpha);

    let t = this.math.divide(xHalfPowered, gammaCurrent);
    let sum = t;

    let gammaPrevious;
    let gammaArg = alphaPlusOne;
    let R;

    for (
      let m = 1;
      Number(this.math.compare(this.math.abs(this.math.divide(t, sum)), eps)) >
      0;
      m++
    ) {
      gammaPrevious = gammaCurrent;

      gammaArg = this.math.add(gammaArg, BIG_NUMBER_CONSTANTS.ONE);
      gammaCurrent = this.math.gamma(gammaArg);

      R = this.math.divide(gammaPrevious, gammaCurrent);
      R = this.math.multiply(R, xHalfSqr);
      R = this.math.divide(R, m);
      R = this.math.unaryMinus(R);

      t = this.math.multiply(R, t);
      sum = this.math.add(t, sum);
    }

    return sum.toString();
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
