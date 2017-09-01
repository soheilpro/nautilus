import { IExpression } from './iexpression';
import { ISortExpression } from './isort-expression';

export class SortExpression implements ISortExpression {
  constructor(public expression: IExpression, public order: number = 1) {
  }
}
