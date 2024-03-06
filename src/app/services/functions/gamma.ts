import * as math from 'mathjs';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import { FunctionType } from '../../models/enums';
import { gamma64, getE, getPi } from '../../../utilities/utilities';
import {
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
  SpecialFunction,
} from './specialFunction';
import { BigNumber, multinomial, multiply } from 'mathjs';

export class GammaFunction extends SpecialFunction {
  constructor() {
    super(FunctionType.GAMMA);
  }

  calculate(params: FunctionParamsForCalculation): number {
    const { x } = params;
    return 0;

    // console.log('x: ' + x);
    // console.log('alpha: ' + alpha);
  }

  calculate64(params: FunctionParamsForCalculationWithBigNumbers): string {
    const { x, eps } = this.stringToBigNumber(params);

    if (this.math.isInteger(x)) {
      return this.naturalFactorial(
        this.math.subtract(x, BIG_NUMBER_CONSTANTS.ONE)
      ).toString();
    }

    return '0';
  }

  private naturalFactorial(n: BigNumber): BigNumber {
    if (n.isZero()) return BIG_NUMBER_CONSTANTS.ONE;
    const nMinus1 = this.math.subtract(n, BIG_NUMBER_CONSTANTS.ONE);
    const fprev = this.naturalFactorial(nMinus1 as BigNumber);
    console.log(n + ' ' + fprev.toString() + ' ' + nMinus1);
    return this.math.multiply(n, fprev) as BigNumber;
  }

  private coefficientAk(k: number, r: BigNumber) {
    let pi = getPi();
    let e = getE();

    let t = this.math.add(r, this.math.bignumber(0.5));
    t = this.math.pow(this.math.divide(e, t), 0.5) as BigNumber;
    t = this.math.divide(t, k) as BigNumber; // j=0

    let sum = t;

    for (let j = 1; j < k; j++) {
      t = this.math.multiply(t, j - k) as BigNumber;
      t = this.math.multiply(t, k + j) as BigNumber;
      t = this.math.divide(t, j + 1) as BigNumber;
      t = this.math.multiply(t, e) as BigNumber;

      let factor = this.math.pow(this.math.add(j + 0.5, r), j + 0.5);
      factor = this.math.divide(
        factor,
        this.math.pow(this.math.add(j + 1.5, r), j + 1.5)
      );
    }

    let c = this.math.pow(this.math.divide(2, pi), 0.5);
    c = this.math.multiply(c, this.math.pow(e, r));
    c = this.math.multiply(c, k);
    c = this.math.multiply(c, sum);

    return k % 2 ? this.math.unaryMinus(c) : c;
  }
}
