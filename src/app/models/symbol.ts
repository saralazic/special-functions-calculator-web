import { MathType } from 'mathjs';

export interface ISymbol {
  symbol: string;
  label: string;
}

export interface ISymbolWithData extends ISymbol {
  data: MathType;
}
