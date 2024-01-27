import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MathType } from 'mathjs';
import {
  brackets,
  digits,
  hyperbolic,
  MULTIPLY_SIGN_ASCII_CODE,
  operators,
  operators2,
  trigonometry,
  unaryOps1,
  unaryOps2,
} from 'src/app/data/calculatorSymbols';
import { Keys } from 'src/app/models/enums';
import { CalculatorService } from 'src/app/services/calculator/calculatorService';
import { ISymbol } from 'src/app/models/symbol';
import { getE, getPi } from 'src/utilities/utilities';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent {
  public expression = new CalculatorService('0');
  public digits = digits;
  public operators = operators;
  public operators2 = operators2;
  public trigonometry = trigonometry;
  public brackets = brackets;
  public unaryOps1 = unaryOps1;
  public unaryOps2 = unaryOps2;
  public hyperbolic = hyperbolic;

  @Output() calculated: EventEmitter<string> = new EventEmitter<string>();

  getLabel(symbol: ISymbol) {
    return symbol.label;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const key = event.key;
    const symbols = [...this.digits, Keys.DOT];
    const operations = ['+', '-', '*', '/'];

    switch (key) {
      case Keys.BACKSPACE:
        this.removeSymbol();
        break;

      case Keys.ENTER:
        this.calculate();
        break;

      case Keys.ESC:
        this.clear();
        break;

      case Keys.PERCENT:
        this.calculateUnaryFunction('percent', -1);
        break;

      default:
        if (symbols.includes(key)) {
          this.addSymbol(key, false);
        } else if (operations.includes(key)) {
          this.setOperator(key);
        }
        break;
    }
  }

  /** wrapper methods */
  setOperator(operator: string): void {
    this.expression.setOperator(operator);
  }

  addBracket(bracket: string): void {
    this.expression.addBracket(bracket === Keys.BRACKET_OPEN);
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
    if (o === Keys.STAR) return MULTIPLY_SIGN_ASCII_CODE; // code for dot instead of star
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
    if (this.expression.isOperand || this.expression.stack.size() < 2)
      return '';
    this.expression.stack.push(this.expression.expression);
    let value = this.expression.evaluate();
    this.resetOperand();

    const stringValue = value.toString();
    this.calculated.emit(stringValue);

    return stringValue;
  }
}
