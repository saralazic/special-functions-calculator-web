import { loadTranslationForFunction } from 'src/utilities/utilities';
import { FunctionType } from '../enums';

/** Every special function has its own class which extends this abstract class
 * it has information about function, translations
 * and does actual calculation for input values
 */

export abstract class SpecialFunction {
  public functionType: FunctionType;
  public translations?: ISpecialFunctionTranslations;

  constructor(type: FunctionType) {
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

    this.translations = {
      name: specialFunctionTranslation.name,
    };

    return this.translations;
  }
}

export interface ISpecialFunctionTranslations {
  name: string;
}

export interface FunctionParamsForCalculation {
  alpha: number;
  x: number;
  eps: number;
  a?: number;
  b?: number;
}

export interface FunctionParamsForCalculationWithBigNumbers {
  alphaBig: string;
  xBig: string;
  epsBig: string;
  a?: string;
  b?: string;
}

export interface FunctionParams {
  real: FunctionParamsForCalculation;
  bignumber: FunctionParamsForCalculationWithBigNumbers;
}
