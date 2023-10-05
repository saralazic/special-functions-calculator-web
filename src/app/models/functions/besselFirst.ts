import * as math from 'mathjs';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import { FunctionType } from '../enums';
import { getE, getPi } from '../../../utilities/utilities';
import {
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
  SpecialFunction,
} from '../specialFunction';

export class BesselFirstKind extends SpecialFunction {
  math = math_64;

  constructor() {
    super(FunctionType.BESSEL_FIRST_KIND);
  }

  calculate(params: FunctionParamsForCalculation): number {
    const { alpha, x } = params;
    const eps: number = params.eps ?? 10 ^ -15;

    const xHalf = x / 2.0;
    const xHalfSqr = xHalf ** 2;

    let gammaArg = alpha + 1.0;
    let gammaCurrent: number = this.math.gamma(gammaArg);

    let t = xHalf ** alpha / gammaCurrent;
    let sum = t;

    let gammaPrevious: number;
    let R: number;

    for (let m = 1; math.abs(t / sum) > eps; m++) {
      gammaPrevious = gammaCurrent;

      gammaArg += 1;
      gammaCurrent = this.math.gamma(gammaArg);
      R = -(xHalfSqr * gammaPrevious) / (m * gammaCurrent);
      t *= R;
      sum += t;
    }

    return sum;
  }

  calculateBig(params: FunctionParamsForCalculationWithBigNumbers): string {
    const { alphaBig, xBig } = params;
    const epsBig = params.epsBig ?? '1e-64';

    const alpha = this.math.bignumber(alphaBig);
    const eps = this.math.bignumber(epsBig);
    const x = this.math.bignumber(xBig);

    let gammaArg = this.math.add(alpha, BIG_NUMBER_CONSTANTS.ONE);
    let gammaCurrent = this.gammaBig(gammaArg);

    const xHalf = this.math.divide(x, BIG_NUMBER_CONSTANTS.TWO);
    const xHalfSqr = this.math.pow(xHalf, BIG_NUMBER_CONSTANTS.TWO);

    const xHalfPowered = this.math.pow(xHalf, alpha);

    let t = this.math.divide(xHalfPowered, gammaCurrent);
    let sum = t;

    let gammaPrevious;
    let R;

    for (
      let m = 1;
      Number(this.math.compare(this.math.abs(this.math.divide(t, sum)), eps)) >
      0;
      m++
    ) {
      gammaPrevious = gammaCurrent;

      gammaArg = this.math.add(gammaArg, BIG_NUMBER_CONSTANTS.ONE);
      gammaCurrent = this.gammaBig(gammaArg);

      R = this.math.divide(gammaPrevious, gammaCurrent);
      R = this.math.multiply(R, xHalfSqr);
      R = this.math.divide(R, m);
      R = this.math.unaryMinus(R);

      t = this.math.multiply(R, t);
      sum = this.math.add(t, sum);
    }

    return sum.toString();
  }

  gammaBig(alpha: math.BigNumber): math.BigNumber {
    if (this.math.isInteger(alpha)) {
      return this.math.gamma(alpha);
    }

    const x = this.math.subtract(alpha, BIG_NUMBER_CONSTANTS.ONE);
    const pi = getPi();
    const e = getE();

    const half = this.math.divide(
      BIG_NUMBER_CONSTANTS.ONE,
      BIG_NUMBER_CONSTANTS.TWO
    );

    let first = this.math.divide(x, e);
    first = this.math.pow(first, x);

    let second = this.math.multiply(
      BIG_NUMBER_CONSTANTS.c12,
      this.math.pow(x, BIG_NUMBER_CONSTANTS.THREE)
    );

    let add = this.math.multiply(
      x,
      this.math.divide(BIG_NUMBER_CONSTANTS.c24, BIG_NUMBER_CONSTANTS.SEVEN)
    );

    second = this.math.add(second, add);

    second = this.math.subtract(second, half);

    second = this.math.divide(BIG_NUMBER_CONSTANTS.ONE, second);
    second = this.math.add(BIG_NUMBER_CONSTANTS.ONE, second);

    let pow = this.math.divide(
      BIG_NUMBER_CONSTANTS.c53,
      BIG_NUMBER_CONSTANTS.c210
    );
    pow = this.math.add(this.math.pow(x, BIG_NUMBER_CONSTANTS.TWO), pow);

    second = this.math.pow(second, pow as math.BigNumber);

    let mul = this.math.multiply(first, second);

    let piX2 = this.math.multiply(BIG_NUMBER_CONSTANTS.TWO, pi);
    piX2 = this.math.multiply(piX2, x);

    return this.math.multiply(
      this.math.pow(piX2, half as math.BigNumber),
      mul
    ) as math.BigNumber;
  }
}
