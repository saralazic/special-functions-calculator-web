export interface IExpression {
  calculateUnaryOperation(operand: string, data: any): number;
  calculateBinaryOperation(): number;
  evaluate(): number;
}
