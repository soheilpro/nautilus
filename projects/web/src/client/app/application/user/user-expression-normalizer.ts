import * as NQL from '../../nql';

export default class UserExpressionNormalizer extends NQL.ExpressionTransformer<{}> {
  visitLocal(expression: NQL.LocalExpression, context: {}): NQL.IExpression {
    if (['username', 'name', 'email'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'String');

    throw new Error('Not supported.');
  }
}
