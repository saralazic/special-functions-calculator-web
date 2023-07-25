import { MathType } from 'mathjs';

export interface IExpression {
  calculateUnaryOperation(operand: string, data: any): MathType;
  calculateBinaryOperation(): MathType;
  evaluate(): MathType;
}
