import { FUNCTION_TYPE } from '../constants';
import { factorial } from '../utilities';

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
