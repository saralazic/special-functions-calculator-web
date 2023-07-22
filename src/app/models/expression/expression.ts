import math from 'mathjs';
import { all, BigNumber, create } from 'mathjs';
import { Stack } from 'src/utilities/stack';
import { IExpression } from './IExpression';

export class Expression implements IExpression {
  math = create(all, { precision: 64 });

  expression: string;
  currentOperand: BigNumber = this.math.bignumber(0);
  previousOperand: BigNumber = this.math.bignumber(0);
  operator: string = '';
  bracket: boolean = false;
  start: boolean = false;
  isOperandReal: boolean = false; // input number having dot
  isOperand: boolean = false;
  radians: boolean = true;
  stack = new Stack<string>();

  constructor(expression: string = '') {
    this.expression = expression;
  }

  evaluate(): number {
    let result: number = 0;
    if (this.stack.size() < 3) return result;
    this.isOperand = false;
    this.currentOperand = math.bignumber(this.stack.pop() ?? '0');
    this.operator = this.stack.pop() ?? '+';
    this.previousOperand = math.bignumber(this.stack.pop() ?? '0');
    if (!this.previousOperand) return 0;

    result = this.calculateBinaryOperation();

    this.currentOperand = math.bignumber(this.expression);

    this.start = true;
    return result;
  }

  calculateBinaryOperation(): number {
    let result: BigNumber = this.math.bignumber(0);

    switch (this.operator) {
      case '+':
        result = math.add(this.previousOperand, this.currentOperand);
        this.show(result);
        break;
      case '-':
        result = math.min(this.previousOperand, this.currentOperand);
        this.show(result);
        break;
      case '*':
        result = math.mul(this.previousOperand, this.currentOperand);
        this.show(result);
        break;
      case '/':
        result = this.previousOperand / this.currentOperand;
        this.show(result);
        break;
      case 'sqrt':
        result = Math.pow(this.previousOperand, 1 / this.currentOperand);
        this.show(result);
        break;
      case 'pow':
        result = Math.pow(this.previousOperand, this.currentOperand);
        this.show(result);
        break;
      case 'yx':
        result = Math.pow(this.currentOperand, this.previousOperand);
        this.show(result);
        break;
      case 'log':
        result = Math.log(this.previousOperand) / Math.log(this.currentOperand);
        break;
    }
    return result;
  }

  calculateUnaryOperation(operand: string, data: any): number {
    let result: number = 0;
    let rad: number = 0;
    let grad = 180 / Math.PI;
    this.currentOperand = math.bignumber(this.expression);

    switch (operand) {
      case 'invert_sign':
        result = this.currentOperand * data;
        break;
      case 'sqrt':
        result = Math.sqrt(this.currentOperand);
        break;
      case 'sqrt3':
        result = Math.pow(this.currentOperand, 1 / 3);
        break;
      case 'ln':
        result = Math.log(this.currentOperand);
        break;
      case 'lg':
        result = Math.log(this.currentOperand) / Math.log(data);
        break;
      case 'pow_base':
        let base = data == 'e' ? Math.E : data;
        result = Math.pow(base, this.currentOperand);
        break;
      case 'pow':
        let step = math.bignumber(data);
        result = Math.pow(this.currentOperand, step);
        break;
      case 'div':
        result = 1 / this.currentOperand;
        break;
      case 'sin':
        rad = this.radians ? this.currentOperand : this.currentOperand / grad;
        result = Math.sin(rad);
        break;
      case 'cos':
        rad = this.radians ? this.currentOperand : this.currentOperand / grad;
        result = Math.cos(rad);
        break;
      case 'tan':
        rad = this.radians ? this.currentOperand : this.currentOperand / grad;
        result = Math.tan(rad);
        break;
      case 'sinh':
        rad = this.radians ? this.currentOperand : this.currentOperand / grad;
        result = (Math.exp(rad) - Math.exp(-rad)) / 2;
        break;
      case 'cosh':
        rad = this.radians ? this.currentOperand : this.currentOperand / grad;
        result = (Math.exp(rad) + Math.exp(-rad)) / 2;
        break;
      case 'tanh':
        rad = this.radians ? this.currentOperand : this.currentOperand / grad;
        result =
          (Math.exp(rad) - Math.exp(-rad)) / (Math.exp(rad) + Math.exp(-rad));
        break;
      case 'asin':
        result = Math.asin(this.currentOperand);
        result = this.radians ? result : result * grad;
        break;
      case 'acos':
        result = Math.acos(this.currentOperand);
        result = this.radians ? result : result * grad;
        break;
      case 'atan':
        result = Math.atan(this.currentOperand);
        result = this.radians ? result : result * grad;
        break;
      case 'asinh':
        result = Math.asinh(this.currentOperand);
        result = this.radians ? result : result * grad;
        break;
      case 'acosh':
        result = Math.acosh(this.currentOperand);
        result = this.radians ? result : result * grad;
        break;
      case 'atanh':
        result = Math.atanh(this.currentOperand);
        result = this.radians ? result : result * grad;
        break;
      case 'rand':
        result = Math.random();
        break;
      case 'factorial':
        let n = Math.ceil(this.currentOperand);
        result = 1;
        for (let i = 1; i <= n; i++) {
          result *= i;
        }
        break;
      case 'percent':
        result = this.currentOperand / 100;
        break;
      case 'ee':
        this.expression = this.currentOperand.toExponential();
        return 0;
    }

    this.start = true;
    this.show(result);
    return result;
  }

  get(): string {
    return this.expression;
  }

  getCurrentOperand(): number {
    return math.bignumber(this.expression);
  }

  setRadians(switcher: boolean): boolean {
    this.radians = switcher;
    return this.radians;
  }

  addBracket(openBracket: boolean): void {
    // brackets can be set only if we have not set them before and we set operand (if we set brackets first - it will not make sense)
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
    // If operator already set - nothing doing
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

  show(value: BigNumber): string {
    this.expression = value.toString();
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
