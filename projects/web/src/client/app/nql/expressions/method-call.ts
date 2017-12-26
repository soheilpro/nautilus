import { Expression } from '../expression';

export class MethodCallExpression extends Expression {
  constructor(public target: Expression, public name: string, public args: Expression[]) {
    super();
  }

  get returnType(): string {
    return 'Any';
  }

  toString(): string {
    return `${this.target.toString()}.${this.name}(${this.args.map(e => e.toString()).join(',')})`;
  }
}
