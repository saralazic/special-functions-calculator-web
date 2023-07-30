import { FUNCTION_TYPE } from '../../data/constants';
import { loadTranslationForFunction } from '../../../utilities/utilities';
import {
  ISpecialFunctionTranslations,
  SpecialFunction,
} from '../specialFunction';
import { math_64 } from 'src/utilities/big_numbers_math';

export class BesselFirstKind extends SpecialFunction {
  math = math_64;

  calculate(n: number, eps: number, x: number): number {
    return 0;
  }

  calculateBig(n: number, epsBig: string, xBig: string): string {
    return '';
  }

  public loadTranslations(translations: any): ISpecialFunctionTranslations {
    const specialFunctionTranslation = loadTranslationForFunction(
      FUNCTION_TYPE.BESSEL_SECOND_KIND,
      translations
    );
    return {
      name: specialFunctionTranslation.name,
    };
  }
}
