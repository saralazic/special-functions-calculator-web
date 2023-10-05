import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import { getE } from 'src/utilities/utilities';
import { ISymbol, ISymbolWithData } from '../models/symbol';

const math = math_64;

export const operators: ISymbol[] = [
  { symbol: '+', label: '&#43;' },
  { symbol: '-', label: '&minus;' },
  { symbol: '*', label: '&times;' },
  { symbol: '/', label: '&divide;' },
];

export const operators2: ISymbol[] = [
  { symbol: 'xy', label: 'x<sup>y</sup>' },
  { symbol: 'yx', label: 'y<sup>x</sup>' },
  { symbol: 'sqrt', label: '<sup>y</sup>&radic;x' },
  { symbol: 'log', label: 'log<sub>y</sub>x' },
];

export const trigonometry: ISymbol[] = [
  { symbol: 'sin', label: 'sin' },
  { symbol: 'cos', label: 'cos' },
  { symbol: 'tan', label: 'tan' },
  { symbol: 'asin', label: 'sin<sup>-1</sup>' },
  { symbol: 'acos', label: 'cos<sup>-1</sup>' },
  { symbol: 'atan', label: 'tan<sup>-1</sup>' },
];

export const brackets: ISymbol[] = [
  { symbol: '(', label: '(' },
  { symbol: ')', label: ')' },
];

export const unaryOps1: ISymbolWithData[] = [
  { symbol: 'pow', label: 'x<sup>2</sup>', data: BIG_NUMBER_CONSTANTS.TWO },
  { symbol: 'pow', label: 'x<sup>3</sup>', data: BIG_NUMBER_CONSTANTS.THREE },
  { symbol: 'pow_base', label: 'e<sup>x</sup>', data: getE() },
  {
    symbol: 'div',
    label: '<sup>1</sup>/<sub>x</sub>',
    data: BIG_NUMBER_CONSTANTS.ONE,
  },
  {
    symbol: 'sqrt',
    label: '<sup>2</sup>&radic;x',
    data: BIG_NUMBER_CONSTANTS.TWO,
  },
  {
    symbol: 'sqrt3',
    label: '<sup>3</sup>&radic;x',
    data: math.divide(BIG_NUMBER_CONSTANTS.ONE, BIG_NUMBER_CONSTANTS.THREE),
  },
];

export const unaryOps2: ISymbolWithData[] = [
  {
    symbol: 'pow_base',
    label: '10<sup>x</sup>',
    data: BIG_NUMBER_CONSTANTS.TEN,
  },
  {
    symbol: 'pow_base',
    label: '2<sup>x</sup>',
    data: BIG_NUMBER_CONSTANTS.TWO,
  },
  { symbol: 'factorial', label: 'x!', data: BIG_NUMBER_CONSTANTS.ONE },
  { symbol: 'ln', label: 'ln', data: getE() },
  { symbol: 'lg', label: 'lg', data: BIG_NUMBER_CONSTANTS.TEN },
  { symbol: 'lg', label: 'log<sub>2</sub>', data: BIG_NUMBER_CONSTANTS.TWO },
];

export const hyperbolic: ISymbol[] = [
  { symbol: 'sinh', label: 'sin<sup>h</sup>' },
  { symbol: 'cosh', label: 'cos<sup>h</sup>' },
  { symbol: 'tanh', label: 'tan<sup>h</sup>' },
  { symbol: 'asinh', label: 'sinh<sup>-1</sup>' },
  { symbol: 'acosh', label: 'cosh<sup>-1</sup>' },
  { symbol: 'atanh', label: 'tanh<sup>-1</sup>' },
];
