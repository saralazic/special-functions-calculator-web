import { factorial } from '../utilities';

export class BesselFirstKind {
  constructor() {}

  calculate(n: number, eps: number, x: number): number {
    let t = 1 / factorial(n);
    let sum = t;

    for (let k = 1; Math.abs(t / sum) > eps; k++) {
      const R = -(x ** 2) / (4 * k * (n + k));
      t *= R;
      sum += t;
    }

    return sum * (x / 2) ** n;
  }
}
