import { Expression } from '../expression';

export class ConstantExpression extends Expression {
  constructor(public value: any, public type: string) {
    super();
  }

  get returnType() {
    return this.type;
  }

  toString() {
    return JSON.stringify(this.value);
  }
}
