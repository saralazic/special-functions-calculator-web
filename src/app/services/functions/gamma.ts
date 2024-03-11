import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import { FunctionType } from '../../models/enums';
import { binomialCoefficient, factorial } from '../../../utilities/utilities';
import {
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
  SpecialFunction,
} from './specialFunction';
import { BigNumber } from 'mathjs';

export class GammaFunction extends SpecialFunction {
  constructor() {
    super(FunctionType.GAMMA);
  }

  calculate(params: FunctionParamsForCalculation): number {
    const { x } = params;
    return 0;
  }

  calculate64(params: FunctionParamsForCalculationWithBigNumbers): string {
    let { x } = this.stringToBigNumber(params);

    x = this.math.subtract(x, BIG_NUMBER_CONSTANTS.ONE);

    const n = 17;
    const g = 12.2252227365970611572265625;

    // if (this.math.isInteger(x)) {
    //   return this.naturalFactorial(
    //     this.math.subtract(x, BIG_NUMBER_CONSTANTS.ONE)
    //   ).toString();
    // }

    const B = this.populateMatrixB(n);
    const C = this.populateMatrixC(n);
    const D = this.populateMatrixD(n);
    const F = this.populateVectorF(n, g);

    let P = this.math.multiply(D, B);

    P = this.math.multiply(P, C);

    P = this.math.multiply(P, F);

    //  console.log(P.toString());

    const vectorZ: BigNumber[] = this.populateVectorZ(x, n);

    console.log('Vector Z: ' + vectorZ.toString());

    let R = this.math.multiply(vectorZ, P);

    let lnZP = this.math.log(R[0]);

    console.log('lnZP: ' + lnZP);

    let xPlusHalf = this.math.add(x, this.math.bignumber(0.5));
    let t = this.math.add(xPlusHalf, this.math.bignumber(g));

    let t1 = this.math.multiply(xPlusHalf, this.math.log(t));

    const logGx = this.math.subtract(this.math.add(lnZP, t1), t);

    const Gx = this.math.exp(logGx as BigNumber);

    console.log('Log 8');

    return Gx.toString();
  }

  private populateVectorZ(x: BigNumber, n: number): BigNumber[] {
    const vectorZ: BigNumber[] = [];
    vectorZ[0] = BIG_NUMBER_CONSTANTS.ONE;
    for (let i = 1; i < n; i++) {
      vectorZ[i] = this.math.divide(
        BIG_NUMBER_CONSTANTS.ONE,
        this.math.add(x, this.math.bignumber(i))
      ) as BigNumber;
    }

    return vectorZ;
  }

  private populateMatrixB(n: number): BigNumber[][] {
    const B: number[][] = [];

    for (let i = 0; i < n; i++) {
      B[i] = [];
      for (let j = 0; j < n; j++) {
        let factor = (i + j) & 1 ? -1 : 1; //(-1)^(j-i)
        B[i][j] =
          i === 0
            ? 1
            : j >= i
            ? factor * binomialCoefficient(i + j - 1, j - i)
            : 0;
      }
    }
    return this.convertNumberMatrixToBigNumber(B);
  }

  private populateMatrixC(n: number): BigNumber[][] {
    const C: number[][] = [];

    for (let i = 0; i < n; i++) {
      C[i] = [];
      for (let j = 0; j < n; j++) {
        C[i][j] =
          i === 0 && j === 0
            ? 0.5
            : j > i
            ? 0
            : this.calculateSumForCMatrix(i, j);
      }
    }
    return this.convertNumberMatrixToBigNumber(C);
  }

  private populateMatrixD(n: number): BigNumber[][] {
    const D: BigNumber[][] = [];

    for (let i = 0; i < n; i++) {
      D[i] = new Array(n).fill(BIG_NUMBER_CONSTANTS.ZERO);
    }

    D[0][0] = BIG_NUMBER_CONSTANTS.ONE;
    D[1][1] = this.math.unaryMinus(BIG_NUMBER_CONSTANTS.ONE);
    for (let i = 2; i < n; i++) {
      D[i][i] = this.math.multiply(
        D[i - 1][i - 1],
        this.math.divide(
          this.math.bignumber(2 * (2 * i - 1)),
          this.math.bignumber(i - 1)
        )
      ) as BigNumber;
    }

    return D;
  }

  private populateVectorF(n: number, g: number): BigNumber[][] {
    const F: BigNumber[][] = [];

    for (let i = 0; i < n; i++) {
      let t1 = this.math.exp(this.math.bignumber(i + g + 0.5));
      t1 = this.math.multiply(
        t1,
        this.math.bignumber(factorial(2 * i))
      ) as BigNumber;
      let t2 = this.math.pow(
        BIG_NUMBER_CONSTANTS.TWO,
        this.math.bignumber(2 * i - 1)
      );
      t2 = this.math.multiply(this.math.bignumber(factorial(i)), t2);
      t2 = this.math.multiply(
        t2,
        this.math.pow(
          this.math.bignumber(g + i + 0.5),
          this.math.bignumber(i + 0.5)
        )
      );
      F[i] = [this.math.divide(t1, t2) as BigNumber];
    }

    return F;
  }

  private calculateSumForCMatrix(i: number, j: number) {
    let factor = (i + j) & 1 ? -1 : 1; //(-1)^(j-i)

    let sum = 0,
      t = 0;
    for (let k = 0; k < i; k++) {
      t = binomialCoefficient(2 * i, 2 * k) * binomialCoefficient(k, k + i - j);
      sum += t;
    }
    return factor * sum;
  }

  private naturalFactorial(n: BigNumber): BigNumber {
    if (n.isZero()) return BIG_NUMBER_CONSTANTS.ONE;
    const nMinus1 = this.math.subtract(n, BIG_NUMBER_CONSTANTS.ONE);
    const fprev = this.naturalFactorial(nMinus1 as BigNumber);
    return this.math.multiply(n, fprev) as BigNumber;
  }

  private convertNumberMatrixToBigNumber(matrix: number[][]): BigNumber[][] {
    return matrix.map((row) => row.map((cell) => this.math.bignumber(cell)));
  }

  private convertBigNumberMatrixToNumber(matrix: BigNumber[][]): number[][] {
    return matrix.map((row) => row.map((cell) => cell.toNumber()));
  }

  private hasNaN(matrix: any[][]): boolean {
    let i = 0,
      j = 0;
    for (let row of matrix) {
      j = 0;
      for (let element of row) {
        if (isNaN(element)) {
          console.log('i,j: ' + i + ', ' + j);
          return true; // If any element is NaN, return true
        }
        j++;
      }
      i++;
    }
    return false; // If no element is NaN, return false
  }

  private roundToZeroIfSmall(x: BigNumber): BigNumber {
    const threshold = this.math.bignumber(1e-64);
    if (this.math.abs(x).lt(threshold)) {
      return BIG_NUMBER_CONSTANTS.ZERO;
    } else {
      return x;
    }
  }
}
