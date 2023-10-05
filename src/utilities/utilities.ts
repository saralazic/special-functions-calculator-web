import { all, BigNumber, create, MathType } from 'mathjs';
import * as Plotly from 'plotly.js-basic-dist';
import { BesselFirstKind } from 'src/app/models/functions/besselFirst';
import { BesselSecondKind } from 'src/app/models/functions/besselSecond';
import { ChebyshevPolynomialOfFirstKind } from 'src/app/models/functions/chebyshevFirst';
import { ChebyshevPolynomialOfSecondKind } from 'src/app/models/functions/chebyshevSecond';
import { JacobiPolynomial } from 'src/app/models/functions/jacobi';
import { LaguerrePolynomial } from 'src/app/models/functions/laguerre';
import { LegendrePolynomial } from 'src/app/models/functions/legendre';
import { SpecialFunction } from 'src/app/models/specialFunction';
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
    type: 'scatter', // Change the type according to the plot you want (e.g., 'scatter', 'bar', etc.)
    mode: 'lines+markers', // Change the mode according to your preference
    marker: { size: 1 }, // Set the size property to adjust the marker size (you can change the value as needed)
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

  // Convert the result of math.compare() to a native JavaScript number using Number()
  return (
    Number(math.compare(valueNumber, zero)) > 0 &&
    Number(math.compare(valueNumber, one)) < 0
  );
}
