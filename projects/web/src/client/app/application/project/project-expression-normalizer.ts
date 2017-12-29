import * as NQL from '../../nql';

export class ProjectExpressionNormalizer extends NQL.ExpressionTransformer<{}> {
  visitLocal(expression: NQL.LocalExpression, context: {}): NQL.IExpression {
    if (['name'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'String');

    throw new Error('Not supported.');
  }
}
