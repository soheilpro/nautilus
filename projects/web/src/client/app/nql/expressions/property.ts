import { Expression } from '../expression';

export class PropertyExpression extends Expression {
  constructor(public target: Expression, public name: string) {
    super();
  }

  get returnType(): string {
    return 'Any';
  }

  toString(): string {
    return `${this.target.toString()}.${this.name}`;
  }
}
