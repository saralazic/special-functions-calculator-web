import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { all, create, MathType, re } from 'mathjs';
import {
  brackets,
  hyperbolic,
  operators,
  operators2,
  trigonometry,
  unaryOps1,
  unaryOps2,
} from 'src/app/data/calculatorSymbols';
import { Expression } from 'src/app/models/expression/expression';
import { ISymbol } from 'src/app/models/symbol';
import { getE, getPi, round } from 'src/utilities/utilities';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent {
  math = create(all, { precision: 64 });

  expression = new Expression('0');
  digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  operators = operators;
  operators2 = operators2;
  trigonometry = trigonometry;
  brackets = brackets;
  unaryOps1 = unaryOps1;
  unaryOps2 = unaryOps2;
  hyperbolic = hyperbolic;

  calculatorIconPath = 'assets/icons/calculator.svg';

  @Output() calculated: EventEmitter<string> = new EventEmitter<string>();

  getLabel(symbol: ISymbol) {
    return symbol.label;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const key = event.key;
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

    if (digits)
      if (digits.includes(key)) {
        this.addSymbol(key, false);
      }

    if (key === 'Backspace') {
      this.removeSymbol();
    }

    if (key === 'Enter') {
      this.calculate();
    }

    if (key === 'Escape') {
      this.clear();
    }

    const operations = ['+', '-', '*', '/'];

    if (operations.includes(key)) {
      this.setOperator(key);
    }

    if (key === '%') {
      this.calculateUnaryFunction('percent', -1);
    }
  }

  //**wrapper */
  setOperator(operator: string): void {
    this.expression.setOperator(operator);
  }

  addBracket(bracket: string): void {
    this.expression.addBracket(bracket === '(');
  }

  getExpression() {
    return this.expression.get();
  }

  clear(): any {
    return this.expression.clear();
  }

  setRadians(): boolean {
    let switcher = !this.getRadians();
    return this.expression.setRadians(switcher);
  }

  getRadians(): boolean {
    return this.expression.radians;
  }

  getOperand(): string {
    let o = this.expression.operator;
    if (o == '*') return '&#215;';
    return o;
  }

  resetOperand() {
    this.expression.operator = '';
  }

  calculateUnaryFunction(operand: string, data: MathType): string {
    const stringValue = this.expression
      .calculateUnaryOperation(operand, data)
      .toString();
    this.calculated.emit(stringValue);
    return stringValue;
  }

  addConstant(isConstantPi: boolean) {
    const value = isConstantPi ? getPi() : getE();
    this.expression.addSymbol(value.toString(), true);
  }

  addSymbol(value: string, start: boolean = false): void {
    this.expression.addSymbol(value, start);
  }

  removeSymbol(): void {
    this.expression.removeSymbol();
  }

  calculate(): string {
    if (this.expression.isOperand == true || this.expression.stack.size() < 2)
      return '';
    this.expression.stack.push(this.expression.expression);
    let value = this.expression.evaluate();
    this.resetOperand();

    const stringValue = value.toString();
    this.calculated.emit(stringValue);

    return stringValue;
  }
}
