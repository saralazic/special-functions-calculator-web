import { all, BigNumber, create, MathType } from 'mathjs';
import * as Plotly from 'plotly.js-basic-dist';
import { FUNCTION_TYPE } from '../app/data/constants';
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
  type: FUNCTION_TYPE,
  translations: any
): any {
  let fn: any;
  switch (type) {
    case FUNCTION_TYPE.BESSEL_FIRST_KIND:
      fn = translations.bessel_1;
      break;
    case FUNCTION_TYPE.BESSEL_SECOND_KIND:
      fn = translations.bessel_2;
      break;
    case FUNCTION_TYPE.LEGENDRE_POLYNOMIAL:
      fn = translations.legendre;
      break;
    case FUNCTION_TYPE.LAGUERRE_POLYNOMIAL:
      fn = translations.laguerre;
      break;
    case FUNCTION_TYPE.CHEBYSHEV_FIRST_KIND:
      fn = translations.chebyshev_1;
      break;
    case FUNCTION_TYPE.CHEBYSHEV_SECOND_KIND:
      fn = translations.chebyshev_2;
      break;
    default:
      fn = translations.bessel_1;
      break;
  }

  return fn;
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
