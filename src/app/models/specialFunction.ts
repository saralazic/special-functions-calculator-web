export abstract class SpecialFunction {
  constructor() {}

  public abstract calculate(n: number, eps: number, x: number): number;
  public abstract loadTranslations(
    translations: any
  ): ISpecialFunctionTranslations;
}

export interface ISpecialFunctionTranslations {
  name: string;
}
