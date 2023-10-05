import { BigNumber, MathType } from 'mathjs';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import { Stack } from 'src/utilities/stack';
import { getE, getPi, round } from 'src/utilities/utilities';
import { IExpression } from './IExpression';

export class Expression implements IExpression {
  math = math_64;

  expression: string;
  currentOperand: MathType = BIG_NUMBER_CONSTANTS.ZERO;
  previousOperand: MathType = BIG_NUMBER_CONSTANTS.ZERO;
  operator: string = '';
  bracket: boolean = false;
  start: boolean = false;
  isOperandReal: boolean = false;
  isOperand: boolean = false;
  radians: boolean = true;
  stack = new Stack<string>();

  constructor(expression: string = '') {
    this.expression = expression;
  }

  evaluate(): MathType {
    let result: MathType = BIG_NUMBER_CONSTANTS.ZERO;
    if (this.stack.size() < 3) return result;
    this.isOperand = false;
    this.currentOperand = this.math.bignumber(this.stack.pop() ?? '0');
    this.operator = this.stack.pop() ?? '+';
    this.previousOperand = this.math.bignumber(this.stack.pop() ?? '0');
    if (!this.previousOperand) return 0;

    result = this.calculateBinaryOperation();

    this.currentOperand = this.math.bignumber(this.expression);

    this.start = true;
    return result;
  }

  calculateBinaryOperation(): MathType {
    let result: MathType = BIG_NUMBER_CONSTANTS.ZERO;
    switch (this.operator) {
      case '+':
        result = this.math.add(this.previousOperand, this.currentOperand);
        this.show(result);
        break;
      case '-':
        result = this.math.subtract(this.previousOperand, this.currentOperand);
        this.show(result);
        break;
      case '*':
        result = this.math.multiply(this.previousOperand, this.currentOperand);
        this.show(result);
        break;
      case '/':
        result = this.math.divide(this.previousOperand, this.currentOperand);
        this.show(result);
        break;
      case 'sqrt':
        // Calculate cur = 1 / currentOperand
        const cur: MathType = this.math.divide(
          BIG_NUMBER_CONSTANTS.ONE,
          this.currentOperand
        );
        // Calculate previousOperand^(1/currentOperand)
        result = this.math.pow(this.previousOperand, cur as BigNumber);
        this.show(result);
        break;
      case 'pow':
      case 'xy':
        result = this.math.pow(
          this.previousOperand,
          this.currentOperand as BigNumber
        );
        this.show(result);
        break;
      case 'yx':
        result = this.math.pow(
          this.currentOperand,
          this.previousOperand as BigNumber
        );
        this.show(result);
        break;
      case 'log':
        const first = this.math.log(this.previousOperand as BigNumber);
        const second = this.math.log(this.currentOperand as BigNumber);
        result = this.math.divide(first, second);
        this.show(result);
        break;
    }
    return result;
  }

  calculateUnaryOperation(operand: string, data: MathType): MathType {
    let add, sub: BigNumber;
    let result: MathType = BIG_NUMBER_CONSTANTS.ZERO;
    let rad: MathType = BIG_NUMBER_CONSTANTS.ZERO;
    let grad: MathType = this.math.divide(this.math.bignumber(180), getPi());

    this.currentOperand = this.math.bignumber(this.expression);

    switch (operand) {
      case 'invert_sign':
        result = this.math.multiply(this.currentOperand, data);
        break;
      case 'sqrt':
        result = this.math.sqrt(this.currentOperand);
        break;
      case 'sqrt3':
        result = this.math.pow(
          this.currentOperand,
          this.math.divide(
            BIG_NUMBER_CONSTANTS.ONE,
            BIG_NUMBER_CONSTANTS.THREE
          ) as BigNumber
        );
        break;
      case 'ln':
        result = this.math.log(this.currentOperand);
        break;
      case 'lg':
        const first = this.math.log(this.currentOperand);
        const second = this.math.log(data as BigNumber);
        result = this.math.divide(first, second);
        break;
      case 'pow_base':
        result = this.math.pow(data, this.currentOperand);
        break;
      case 'pow':
        let step = this.math.bignumber(data as BigNumber);
        result = this.math.pow(this.currentOperand, step);
        break;
      case 'div':
        result = this.math.divide(1, this.currentOperand);
        break;
      case 'sin':
        rad = this.radians
          ? this.currentOperand
          : this.math.divide(this.currentOperand, grad);

        result = this.math.sin(rad as BigNumber);
        break;
      case 'cos':
        rad = this.radians
          ? this.currentOperand
          : this.math.divide(this.currentOperand, grad);
        result = this.math.cos(rad as BigNumber);
        break;
      case 'tan':
        rad = this.radians
          ? this.currentOperand
          : this.math.divide(this.currentOperand, grad);
        result = this.math.tan(rad as BigNumber);
        break;
      case 'sinh':
        rad = this.radians
          ? this.currentOperand
          : this.math.divide(this.currentOperand, grad);
        sub = this.math.subtract(
          this.math.exp(rad as BigNumber),
          this.math.exp(this.math.unaryMinus(rad) as BigNumber)
        );
        result = this.math.divide(sub, BIG_NUMBER_CONSTANTS.TWO);
        break;
      case 'cosh':
        rad = this.radians
          ? this.currentOperand
          : this.math.divide(this.currentOperand, grad);

        add = this.math.add(
          this.math.exp(rad as BigNumber),
          this.math.exp(this.math.unaryMinus(rad) as BigNumber)
        );
        result = this.math.divide(add, BIG_NUMBER_CONSTANTS.TWO);
        break;
      case 'tanh':
        rad = this.radians
          ? this.currentOperand
          : this.math.divide(this.currentOperand, grad);

        add = this.math.add(
          this.math.exp(rad as BigNumber),
          this.math.exp(this.math.unaryMinus(rad) as BigNumber)
        );
        sub = this.math.subtract(
          this.math.exp(rad as BigNumber),
          this.math.exp(this.math.unaryMinus(rad) as BigNumber)
        );
        result = this.math.divide(sub, add);
        break;
      case 'asin':
        result = this.math.asin(this.currentOperand);
        result = this.radians ? result : this.math.multiply(result, grad);
        break;
      case 'acos':
        result = this.math.acos(this.currentOperand);
        result = this.radians ? result : this.math.multiply(result, grad);
        break;
      case 'atan':
        result = this.math.atan(this.currentOperand);
        result = this.radians ? result : this.math.multiply(result, grad);
        break;
      case 'asinh':
        result = this.math.asinh(this.currentOperand);
        result = this.radians ? result : this.math.multiply(result, grad);
        break;
      case 'acosh':
        result = this.math.acosh(this.currentOperand);
        result = this.radians ? result : this.math.multiply(result, grad);
        break;
      case 'atanh':
        result = this.math.atanh(this.currentOperand);
        result = this.radians ? result : this.math.multiply(result, grad);
        break;
      case 'rand':
        result = this.math.divide(this.math.random(), getE());
        break;
      case 'factorial':
        result = this.math.factorial(this.currentOperand);
        break;
      case 'percent':
        result = this.math.divide(this.currentOperand, 100);
        break;
      case 'ee':
        this.expression = this.currentOperand.toExponential();
        break;
    }

    this.start = true;

    this.show(result);
    return result;
  }

  get(): string {
    return this.expression;
  }

  setRadians(switcher: boolean): boolean {
    this.radians = switcher;
    return this.radians;
  }

  /* only one level of brackets 
  and they can be set only if user set the operand first
  */
  addBracket(openBracket: boolean): void {
    if (openBracket) {
      if (this.bracket == false && this.isOperand == true) {
        this.stack.push('(');
        this.bracket = true;
        this.isOperand = false;
        return;
      }
      return;
    }
    if (this.bracket == true && this.isOperand != true) {
      this.bracket = false;
      this.stack.push(this.expression);
      this.stack.push(')');
      this.isOperand = false;
      this.start = true;
      this.expression = eval(this.stack.join()).toString();
      this.stack.clear();
      this.stack.push(this.expression);
    }
  }

  setOperator(operand: string): void {
    this.operator = operand;
    if (this.isOperand) {
      this.operator = operand;
      return;
    }
    this.isOperand = true;
    this.stack.push(this.expression);
    this.stack.push(this.operator);
    this.start = true;
  }

  addSymbol(value: string, start: boolean): string {
    if (
      start ||
      this.start ||
      (this.isOperandReal == false && this.expression == '0' && value != '.')
    ) {
      this.expression = '';
    }
    this.start = start;
    if (value == '.') {
      if (this.isOperandReal == true) {
        return this.expression;
      }
      this.isOperandReal = true;
    }
    this.expression += value;
    this.isOperand = false;
    return this.expression;
  }

  removeSymbol(): void {
    let length = this.expression.length;
    let last_symbol = this.expression.substring(length - 1, length);
    if (last_symbol == '.') {
      this.isOperandReal = false;
    }
    this.expression = this.expression.slice(0, -1);
  }

  show(value: MathType): string {
    this.expression = round(value.toString());
    return this.expression;
  }

  clear(): string {
    this.expression = '0';

    this.isOperandReal = false;
    this.isOperand = false;
    this.operator = '';
    this.start = false;
    this.stack.clear();
    this.bracket = false;
    return this.expression;
  }
}
