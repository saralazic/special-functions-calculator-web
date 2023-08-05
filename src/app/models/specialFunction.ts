import { loadTranslationForFunction } from 'src/utilities/utilities';
import { FUNCTION_TYPE } from '../data/constants';

export abstract class SpecialFunction {
  public functionType: FUNCTION_TYPE;

  constructor(type: FUNCTION_TYPE) {
    this.functionType = type;
  }

  public abstract calculateBig(
    params: FunctionParamsForCalculationWithBigNumbers
  ): string;

  public abstract calculate(params: FunctionParamsForCalculation): number;

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

export interface FunctionParamsForCalculation {
  alpha: number;
  x: number;
  eps?: number;
}

export interface FunctionParamsForCalculationWithBigNumbers {
  alphaBig: string;
  xBig: string;
  epsBig?: string;
}
