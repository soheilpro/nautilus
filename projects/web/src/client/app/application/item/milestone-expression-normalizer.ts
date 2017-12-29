import * as NQL from '../../nql';

export class MilestoneExpressionNormalizer extends NQL.ExpressionTransformer<{}> {
  visitLocal(expression: NQL.LocalExpression, context: {}): NQL.IExpression {
    if (['sid', 'title', 'fullTitle'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'String');

    if (['project'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'Project');

    if (['state'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'ItemState');

    if (['createdBy'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'User');

    throw new Error('Not supported.');
  }
}
