import { Expression } from '../expression';

export class PropertyExpression extends Expression {
  constructor(public target: Expression, public name: string) {
    super();
  }

  get returnType() {
    return 'Any';
  }

  toString() {
    return `${this.target.toString()}.${this.name}`;
  }
}
