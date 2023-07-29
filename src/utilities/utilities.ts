import { all, BigNumber, create, MathType } from 'mathjs';
import * as Plotly from 'plotly.js-basic-dist';
import { FUNCTION_TYPE } from '../app/data/constants';

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
  }

  return fn;
}

export function getE(): MathType {
  const math = create(all, { precision: 64 });
  return math.exp(math.bignumber(1));
}

export function getPi(): MathType {
  const math = create(all, { precision: 64 });
  // const piValue: BigNumber = math.bignumber(
  //   '3.1415926535897932384626433832795028841971693993751058209749445923078164'
  // );
  const piHalf: BigNumber = math.acos(math.bignumber(0));
  return math.multiply(piHalf, math.bignumber(2) as BigNumber);
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

// Initialize the math object globally at an appropriate place (e.g., top of the file or in a service)
const math = create(all, { number: 'BigNumber', precision: 64 });

export function checkIfBigNumberIsPrecision(value: string): boolean {
  const valueNumber = math.bignumber(value);
  const zero = math.bignumber(0);
  const one = math.bignumber(1);

  // Convert the result of math.compare() to a native JavaScript number using Number()
  return (
    Number(math.compare(valueNumber, zero)) > 0 &&
    Number(math.compare(valueNumber, one)) < 0
  );
}
