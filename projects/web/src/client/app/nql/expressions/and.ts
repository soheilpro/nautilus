import { Expression } from '../expression';
import { OrExpression } from './or';

export class AndExpression extends Expression {
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
    }).join(' AND ');
  }
}
