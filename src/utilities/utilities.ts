import { all, BigNumber, create, MathType } from 'mathjs';
import * as Plotly from 'plotly.js-basic-dist';
import { BesselFirstKind } from 'src/app/models/functions/besselFirst';
import { BesselSecondKind } from 'src/app/models/functions/besselSecond';
import { ChebyshevPolynomialOfFirstKind } from 'src/app/models/functions/chebyshevFirst';
import { ChebyshevPolynomialOfSecondKind } from 'src/app/models/functions/chebyshevSecond';
import { JacobiPolynomial } from 'src/app/models/functions/jacobi';
import { LaguerrePolynomial } from 'src/app/models/functions/laguerre';
import { LegendrePolynomial } from 'src/app/models/functions/legendre';
import { SpecialFunction } from 'src/app/models/functions/specialFunction';
import { FunctionType } from '../app/models/enums';
import { BIG_NUMBER_CONSTANTS, math_64 } from './big_numbers_math';

const math = math_64;

export function factorial(n: number): number {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

export function drawGraph(
  element: HTMLElement,
  xValues: number[],
  yValues: number[]
) {
  const trace: Partial<Plotly.ScatterData> = {
    x: xValues,
    y: yValues,
    type: 'scatter',
    mode: 'lines+markers',
    marker: { size: 1 },
  };

  const layout: Partial<Plotly.Layout> = {
    // Add any layout configuration you need here
  };

  const data = [trace];

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
    case FunctionType.BESSEL_SECOND_KIND:
      fn = translations.bessel_2;
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
    case FunctionType.BESSEL_SECOND_KIND:
      spef = new BesselSecondKind();
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
    default:
      spef = new BesselFirstKind();
      break;
  }

  return spef;
}

export function getE(): MathType {
  return math.exp(BIG_NUMBER_CONSTANTS.ONE);
}

export function getPi(): MathType {
  // const piValue: BigNumber = math.bignumber(
  //   '3.1415926535897932384626433832795028841971693993751058209749445923078164'
  // );
  const piHalf: BigNumber = math.acos(BIG_NUMBER_CONSTANTS.ZERO);
  return math.multiply(piHalf, BIG_NUMBER_CONSTANTS.TWO as BigNumber);
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
  const valueNumber = math.bignumber(value);
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
  n: number,
  eps: number
) {
  /** For this three functions domain is (-1,1), for the rest I will use 0-10 */
  if (
    parameter === FunctionType.LEGENDRE_POLYNOMIAL ||
    parameter === FunctionType.CHEBYSHEV_FIRST_KIND ||
    parameter === FunctionType.CHEBYSHEV_SECOND_KIND
  ) {
    const startValue: number = -0.999999;
    const endValue: number = 0.999999;
    const numParameters: number = 201;

    const step: number = (endValue - startValue) / (numParameters - 1);
    const xArr: number[] = Array.from(
      { length: numParameters },
      (_, index) => startValue + index * step
    );

    const yArr = xArr.map(
      (x) =>
        spef?.calculate({
          alpha: n,
          x: x,
          eps: eps,
        }) ?? 0
    );

    return { xArr, yArr };
  }

  /** TODO: Should I change this so I draw around calculated value and show this value different color? */
  const xArr = Array.from({ length: 201 }, (_, index) => index * 0.05);
  const yArr = xArr.map(
    (x) =>
      spef?.calculate({
        alpha: n,
        x: x,
        eps: eps,
      }) ?? 0
  );

  return { xArr, yArr };
}

/** This is the most accurate approximation I managed to implement
 * since BigMath doesn't have
 * Previously I tried Ramanujan, Stirling, Zhen-Hang Yang
 * Used aproximation: https://www.sciencedirect.com/science/article/pii/S0022314X16000068
 */
export function gammaBig(alpha: math.BigNumber): math.BigNumber {
  if (math_64.isInteger(alpha)) {
    return math_64.gamma(alpha);
  }

  const x = math_64.subtract(alpha, BIG_NUMBER_CONSTANTS.ONE);
  const pi = getPi();
  const e = getE();

  const half = math_64.divide(
    BIG_NUMBER_CONSTANTS.ONE,
    BIG_NUMBER_CONSTANTS.TWO
  );

  let first = math_64.divide(x, e);
  first = math_64.pow(first, x);

  let second = math_64.multiply(
    BIG_NUMBER_CONSTANTS.c12,
    math_64.pow(x, BIG_NUMBER_CONSTANTS.THREE)
  );

  let add = math_64.multiply(
    x,
    math_64.divide(BIG_NUMBER_CONSTANTS.c24, BIG_NUMBER_CONSTANTS.SEVEN)
  );

  second = math_64.add(second, add);

  second = math_64.subtract(second, half);

  second = math_64.divide(BIG_NUMBER_CONSTANTS.ONE, second);
  second = math_64.add(BIG_NUMBER_CONSTANTS.ONE, second);

  let pow = math_64.divide(BIG_NUMBER_CONSTANTS.c53, BIG_NUMBER_CONSTANTS.c210);
  pow = math_64.add(math_64.pow(x, BIG_NUMBER_CONSTANTS.TWO), pow);

  second = math_64.pow(second, pow as math.BigNumber);

  let mul = math_64.multiply(first, second);

  let piX2 = math_64.multiply(BIG_NUMBER_CONSTANTS.TWO, pi);
  piX2 = math_64.multiply(piX2, x);

  return math_64.multiply(
    math_64.pow(piX2, half as math.BigNumber),
    mul
  ) as math.BigNumber;
}
