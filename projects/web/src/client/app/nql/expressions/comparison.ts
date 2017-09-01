import { Expression } from '../expression';

export class ComparisonExpression extends Expression {
  constructor(public left: Expression, public right: Expression, public operator: string) {
    super();
  }

  get returnType() {
    return 'Boolean';
  }

  toString() {
    return `${this.left.toString()} ${this.operator} ${this.right.toString()}`;
  }
}
