import { Expression } from '../expression';

export class ComparisonExpression extends Expression {
  constructor(public left: Expression, public right: Expression, public operator: string) {
    super();
  }

  get returnType(): string {
    return 'Boolean';
  }

  toString(): string {
    return `${this.left.toString()} ${this.operator} ${this.right.toString()}`;
  }
}
