import { ISymbol, ISymbolWithData } from '../models/symbol';

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
  { symbol: 'log', label: 'log<sub>y</sub>' },
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
  { symbol: 'pow', label: 'x<sup>2</sup>', data: 2 },
  { symbol: 'pow', label: 'x<sup>3</sup>', data: 3 },
  { symbol: 'pow_base', label: 'e<sup>x</sup>', data: 'e' },
  { symbol: 'div', label: '<sup>1</sup>/<sub>x</sub>', data: 1 },
  { symbol: 'sqrt', label: '<sup>2</sup>&radic;x', data: 2 },
  { symbol: 'sqrt3', label: '<sup>3</sup>&radic;x<', data: 1 / 3 },
];

export const unaryOps2: ISymbolWithData[] = [
  { symbol: 'pow_base', label: '10<sup>x</sup>', data: 10 },
  { symbol: 'pow_base', label: '2<sup>x</sup>', data: 2 },
  { symbol: 'factorial', label: 'x!', data: 1 },
  { symbol: 'ee', label: 'EE', data: 1 },
  { symbol: 'ln', label: 'ln', data: 2.7 },
  { symbol: 'lg', label: 'lg', data: 10 },
  { symbol: 'lg', label: 'log<sub>2</sub>', data: 2 },
];

export const hyperbolic: ISymbol[] = [
  { symbol: 'sinh', label: 'sin<sup>h</sup>' },
  { symbol: 'cosh', label: 'cos<sup>h</sup>' },
  { symbol: 'tanh', label: 'tan<sup>h</sup>' },
  { symbol: 'asinh', label: 'sinh<sup>-1</sup>' },
  { symbol: 'acosh', label: 'cosh<sup>-1</sup>' },
  { symbol: 'atanh', label: 'tanh<sup>-1</sup>' },
];
