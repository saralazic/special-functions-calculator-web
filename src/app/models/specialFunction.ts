import { loadTranslationForFunction } from 'src/utilities/utilities';
import { FUNCTION_TYPE } from '../data/constants';

export abstract class SpecialFunction {
  public functionType: FUNCTION_TYPE;

  constructor(type: FUNCTION_TYPE) {
    this.functionType = type;
  }

  public abstract calculateBig(n: string, eps: string, x: string): string;

  public abstract calculate(n: number, eps: number, x: number): number;

  public loadTranslations(translations: any): ISpecialFunctionTranslations {
    const specialFunctionTranslation = loadTranslationForFunction(
      this.functionType,
      translations
    );
    return {
      name: specialFunctionTranslation.name,
    };
  }
}

export interface ISpecialFunctionTranslations {
  name: string;
}
