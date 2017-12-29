import * as NQL from '../../nql';

export class IssueExpressionNormalizer extends NQL.ExpressionTransformer<{}> {
  visitLocal(expression: NQL.LocalExpression, context: {}): NQL.IExpression {
    if (['sid', 'title'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'String');

    if (['project'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'Project');

    if (['type'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'ItemType');

    if (['state'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'ItemState');

    if (['assignedTo', 'createdBy'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'User');

    if (['milestone'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'Milestone');

    throw new Error('Not supported.');
  }
}
