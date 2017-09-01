import { Expression } from '../expression';

export class LocalExpression extends Expression {
  constructor(public name: string) {
    super();
  }

  get returnType() {
    return 'Any';
  }

  toString() {
    return this.name;
  }
}
