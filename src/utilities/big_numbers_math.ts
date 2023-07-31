import { all, create } from 'mathjs';

// Initialize the math object globally at an appropriate place (e.g., top of the file or in a service)
export const math_64 = create(all, { number: 'BigNumber', precision: 64 });

export class BIG_NUMBER_CONSTANTS {
  public static ZERO = math_64.bignumber(0);
  public static ONE = math_64.bignumber(1);
  public static TWO = math_64.bignumber(2);
  public static THREE = math_64.bignumber(3);
  public static FOUR = math_64.bignumber(4);
  public static SIX = math_64.bignumber(6);
  public static EIGHT = math_64.bignumber(8);
  public static TEN = math_64.bignumber(10);
  public static THIRTY = math_64.bignumber(30);
}
