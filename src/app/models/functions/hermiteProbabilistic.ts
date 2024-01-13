import * as math from 'mathjs';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import { FunctionType } from '../enums';
import {
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
  SpecialFunction,
} from './specialFunction';
import { HermitePhysicist } from './hermitePhysicist';

export class HermiteProbabilistic extends SpecialFunction {
  math = math_64;

  constructor(private hermitePhysicist = new HermitePhysicist()) {
    super(FunctionType.HERMITE_PROBABILISTIC);
  }

  calculate(params: FunctionParamsForCalculation): number {
    const { alpha, x } = params;

    const xPhy = x / 2 ** 0.5;

    const yPhy = this.hermitePhysicist.calculate({
      alpha: params.alpha,
      x: xPhy,
      eps: params.eps,
    });

    const factor = 2 ** (-alpha / 2);

    return factor * yPhy;
  }

  calculateBig(params: FunctionParamsForCalculationWithBigNumbers): string {
    const { alphaBig, xBig } = params;

    const alpha = this.math.bignumber(alphaBig);
    const x = this.math.bignumber(xBig);

    const sqrt2 = this.math.sqrt(BIG_NUMBER_CONSTANTS.TWO);
    const xPhy = this.math.divide(x, sqrt2);

    const yPhy = this.hermitePhysicist.calculateBig({
      alphaBig: params.alphaBig,
      xBig: xPhy.toString(),
      epsBig: params.epsBig,
    });

    const factor = this.math.pow(
      BIG_NUMBER_CONSTANTS.TWO,
      this.math.divide(
        this.math.unaryMinus(alpha),
        BIG_NUMBER_CONSTANTS.TWO
      ) as math.BigNumber
    );

    const solution = this.math.multiply(this.math.bignumber(yPhy), factor);

    return solution.toString();
  }
}
