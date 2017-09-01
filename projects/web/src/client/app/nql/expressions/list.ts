import { Expression } from '../expression';

export class ListExpression extends Expression {
  constructor(public children: Expression[]) {
    super();
  }

  get returnType() {
    return 'List';
  }

  toString() {
    return `[${this.children.map(e => e.toString()).join(', ')}]`;
  }
}
