import { Expression } from '../expression';

export class OrExpression extends Expression {
  constructor(public children: Expression[]) {
    super();
  }

  get returnType(): string {
    return 'Boolean';
  }

  toString(): string {
    return this.children.map(e => {
      if (e instanceof OrExpression)
        return `(${e.toString()})`;

      return e.toString();
    }).join(' OR ');
  }
}
