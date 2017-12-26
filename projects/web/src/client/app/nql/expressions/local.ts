import { Expression } from '../expression';

export class LocalExpression extends Expression {
  constructor(public name: string) {
    super();
  }

  get returnType(): string {
    return 'Any';
  }

  toString(): string {
    return this.name;
  }
}
