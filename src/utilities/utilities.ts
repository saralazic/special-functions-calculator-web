import * as math from 'mathjs';
import { BigNumber, exp, MathType, multiply } from 'mathjs';
import * as Plotly from 'plotly.js-basic-dist';
import { BesselFirstKind } from 'src/app/services/functions/besselFirst';
import { BetaFunction } from 'src/app/services/functions/beta';
import { ChebyshevPolynomialOfFirstKind } from 'src/app/services/functions/chebyshevFirst';
import { ChebyshevPolynomialOfSecondKind } from 'src/app/services/functions/chebyshevSecond';
import { GammaFunction } from 'src/app/services/functions/gamma';
import { HermitePhysicist } from 'src/app/services/functions/hermitePhysicist';
import { HermiteProbabilistic } from 'src/app/services/functions/hermiteProbabilistic';
import { JacobiPolynomial } from 'src/app/services/functions/jacobi';
import { LaguerrePolynomial } from 'src/app/services/functions/laguerre';
import { LegendrePolynomial } from 'src/app/services/functions/legendre';
import {
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
  SpecialFunction,
} from 'src/app/services/functions/specialFunction';
import { FunctionType } from '../app/models/enums';
import { BIG_NUMBER_CONSTANTS, math_64 } from './big_numbers_math';

export function factorial(n: number): number {
  if (n === 0 || n === 1) {
    return 1;
  }

  if (Math.trunc(n) == n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }

    return result;
  }

  return math.number(stirling_factorial(math.bignumber(n)) as BigNumber);
}

export function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0) return 1;

  const den = factorial(k) * factorial(n - k);
  return factorial(n) / den;
}

export function binomialCoefficient64(n: BigNumber, k: BigNumber): BigNumber {
  if (k === BIG_NUMBER_CONSTANTS.ZERO) return BIG_NUMBER_CONSTANTS.ONE;

  const den = math_64.multiply(
    stirling_factorial(k),
    stirling_factorial(math_64.subtract(n, k))
  );

  return math_64.divide(stirling_factorial(n), den) as BigNumber;
}

export function drawGraph(
  element: HTMLElement,
  xCoordinates: number[],
  yCoordinates: number[],
  x: number,
  y: number
) {
  const functionGraph: Partial<Plotly.ScatterData> = {
    x: xCoordinates,
    y: yCoordinates,
    type: 'scatter',
    mode: 'lines+markers',
    marker: { size: 0.5 },
  };

  const calculatedValue: Partial<Plotly.ScatterData> = {
    x: [x],
    y: [y],
    mode: 'markers',
    type: 'scatter',
    marker: { size: 5, color: 'red' }, // Color for the specific spot
  };

  const layout: Partial<Plotly.Layout> = {
    title: 'Graph',
    xaxis: {
      title: 'x',
    },
    yaxis: {
      title: 'f(x)',
    },
    showlegend: false,
    margin: {
      r: 50,
      b: 50,
      t: 50,
    },
    hovermode: 'closest', // Show hover information for the closest data point
    autosize: false,
  };
  const data = [functionGraph, calculatedValue];

  Plotly.newPlot(element, data, layout);
}

export function loadTranslationForFunction(
  type: FunctionType,
  translations: any
): any {
  let fn: any;
  switch (type) {
    case FunctionType.BESSEL_FIRST_KIND:
      fn = translations.bessel_1;
      break;
    case FunctionType.BETA:
      fn = translations.beta;
      break;
    case FunctionType.GAMMA:
      fn = translations.gamma;
      break;
    case FunctionType.LEGENDRE_POLYNOMIAL:
      fn = translations.legendre;
      break;
    case FunctionType.LAGUERRE_POLYNOMIAL:
      fn = translations.laguerre;
      break;
    case FunctionType.CHEBYSHEV_FIRST_KIND:
      fn = translations.chebyshev_1;
      break;
    case FunctionType.CHEBYSHEV_SECOND_KIND:
      fn = translations.chebyshev_2;
      break;
    case FunctionType.JACOBI_POLYNOMIAL:
      fn = translations.jacobi;
      break;
    case FunctionType.HERMITE_PHYSICIST:
      fn = translations.hermite_1;
      break;
    case FunctionType.HERMITE_PROBABILISTIC:
      fn = translations.hermite_2;
      break;
    default:
      fn = translations.bessel_1;
      break;
  }

  return fn;
}

export function createChosenFunction(parameter: string): SpecialFunction {
  let spef: SpecialFunction;
  switch (parameter) {
    case FunctionType.BESSEL_FIRST_KIND:
      spef = new BesselFirstKind();
      break;
    case FunctionType.GAMMA:
      spef = new GammaFunction();
      break;
    case FunctionType.BETA:
      spef = new BetaFunction();
      break;
    case FunctionType.LEGENDRE_POLYNOMIAL:
      spef = new LegendrePolynomial();
      break;
    case FunctionType.LAGUERRE_POLYNOMIAL:
      spef = new LaguerrePolynomial();
      break;
    case FunctionType.CHEBYSHEV_FIRST_KIND:
      spef = new ChebyshevPolynomialOfFirstKind();
      break;
    case FunctionType.CHEBYSHEV_SECOND_KIND:
      spef = new ChebyshevPolynomialOfSecondKind();
      break;
    case FunctionType.JACOBI_POLYNOMIAL:
      spef = new JacobiPolynomial();
      break;
    case FunctionType.HERMITE_PHYSICIST:
      spef = new HermitePhysicist();
      break;
    case FunctionType.HERMITE_PROBABILISTIC:
      spef = new HermiteProbabilistic();
      break;
    default:
      spef = new BesselFirstKind();
      break;
  }

  return spef;
}

export function getE(): MathType {
  return math_64.exp(BIG_NUMBER_CONSTANTS.ONE);
}

export function getPi(): MathType {
  // const piValue: BigNumber = math.bignumber(
  //   '3.1415926535897932384626433832795028841971693993751058209749445923078164'
  // );
  const piHalf: BigNumber = math_64.acos(BIG_NUMBER_CONSTANTS.ZERO);
  return math_64.multiply(piHalf, BIG_NUMBER_CONSTANTS.TWO as BigNumber);
}

export function round(stringVal: string): string {
  if (stringVal.length > 60) {
    let lastchars = stringVal.slice(-4);
    if (
      lastchars[0] === 'e' &&
      lastchars[1] === '-' &&
      +lastchars.slice(2) >= 64
    ) {
      return '0';
    }
  }
  return stringVal;
}

export function checkIfBigNumberIsPrecision(value: string): boolean {
  const valueNumber = math_64.bignumber(value);
  const zero = BIG_NUMBER_CONSTANTS.ZERO;
  const one = BIG_NUMBER_CONSTANTS.ONE;

  return (
    Number(math.compare(valueNumber, zero)) > 0 &&
    Number(math.compare(valueNumber, one)) < 0
  );
}

/** parameters are declared as null or undefined only because in special function component 
 this members are not assigned in constructor, they are assigned in onInit
 so they will never be null or undefined actually */
export function generateCoordinates(
  parameter: string | null,
  spef: SpecialFunction | undefined,
  data: FunctionParamsForCalculation
) {
  const numParameters: number = 201;
  let startValue: number, endValue: number;

  /** For this three functions domain is (-1,1), for the rest I will use domain around x */
  const drawFullDomain =
    parameter === FunctionType.LEGENDRE_POLYNOMIAL ||
    parameter === FunctionType.CHEBYSHEV_FIRST_KIND ||
    parameter === FunctionType.CHEBYSHEV_SECOND_KIND ||
    parameter === FunctionType.JACOBI_POLYNOMIAL;

  startValue = drawFullDomain ? -0.999999 : data.x - 3;
  endValue = drawFullDomain ? 0.999999 : data.x + 3;

  const step: number = (endValue - startValue) / (numParameters - 1);
  const xArr: number[] = Array.from(
    { length: numParameters },
    (_, index) => startValue + index * step
  );

  const yArr = xArr.map((x) => spef?.calculate({ ...data, x: x }) ?? 0);

  return { xArr, yArr };
}

/** This is the most accurate approximation I managed to implement
 * since BigMath doesn't have
 * Previously I tried Ramanujan, Stirling, Zhen-Hang Yang
 * Used aproximation: https://sci-hub.se/https://link.springer.com/article/10.1007/s11139-013-9494-y
 */

export function gamma64(alpha: math.BigNumber): MathType {
  if (math_64.isInteger(alpha)) {
    return math_64.gamma(alpha);
  }

  return stirling_factorial(math_64.subtract(alpha, 1) as BigNumber);
}

function stirling_factorial(n: BigNumber): MathType {
  if (n.isInteger()) {
    return math_64.factorial(n);
  }

  let mul = math_64.multiply(2, getPi());
  mul = math_64.multiply(n, mul);
  const sqrt_2pi_n = math_64.sqrt(mul as BigNumber);
  let ndivE = math_64.divide(n, getE());
  let pow_n_over_e = math_64.pow(ndivE, n);

  const result = math_64.multiply(sqrt_2pi_n, pow_n_over_e);
  return math_64.multiply(result, factorial_factor(n));
}

function factorial_factor(n: BigNumber) {
  if (math_64.number(n) >= 2) {
    let res = BIG_NUMBER_CONSTANTS.ONE;
    res = math_64.add(res, math_64.multiply(2, n)) as BigNumber;
    res = math_64.add(
      res,
      math_64.divide(1, math_64.multiply(8, math_64.pow(n, 2)))
    ) as BigNumber;
    res = math_64.add(
      res,
      math_64.divide(1, math_64.multiply(240, math_64.pow(n, 3)))
    ) as BigNumber;
    res = math_64.subtract(
      res,
      math_64.divide(11, math_64.multiply(1920, math_64.pow(n, 4)))
    ) as BigNumber;
    res = math_64.add(
      res,
      math_64.divide(79, math_64.multiply(26880, math_64.pow(n, 5)))
    ) as BigNumber;

    return math_64.pow(res, math.bignumber(1 / 6));
  }
  return math_64.pow(
    getE(),
    math_64.divide(1, math_64.multiply(12, n)) as BigNumber
  );
}

export function initializeParams(): FunctionParamsForCalculation {
  return {
    x: 0,
    y: 0,
    alpha: 0,
    a: 0,
    b: 0,
    eps: 1e-64,
  };
}

export function initializeParams64(): FunctionParamsForCalculationWithBigNumbers {
  return {
    xBig: '0',
    yBig: '0',
    alphaBig: '0',
    a: '0',
    b: '0',
    epsBig: '1e-64',
  };
}
