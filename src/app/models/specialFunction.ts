export abstract class SpecialFunction {
  public abstract calculateBig(n: number, eps: string, x: string): string;

  public abstract calculate(n: number, eps: number, x: number): number;
  public abstract loadTranslations(
    translations: any
  ): ISpecialFunctionTranslations;
}

export interface ISpecialFunctionTranslations {
  name: string;
}
