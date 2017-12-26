import { Expression } from '../expression';

export class CastExpression extends Expression {
  constructor(public child: Expression, public type: string) {
    super();
  }

  get returnType(): string {
    return this.type;
  }

  toString(): string {
    return `(${this.type})(${this.child.toString()})`;
  }
}
