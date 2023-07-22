export interface ISymbol {
  symbol: string;
  label: string;
}

export interface ISymbolWithData extends ISymbol {
  data: number | string;
}
