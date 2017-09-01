import { Expression } from '../expression';

export class CastExpression extends Expression {
  constructor(public child: Expression, public type: string) {
    super();
  }

  get returnType() {
    return this.type;
  }

  toString() {
    return `(${this.type})(${this.child.toString()})`;
  }
}
