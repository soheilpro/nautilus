import { IExpression } from './iexpression';
import { AndExpression } from './expressions/and';
import { CastExpression } from './expressions/cast';
import { ComparisonExpression } from './expressions/comparison';
import { ConstantExpression } from './expressions/constant';
import { ListExpression } from './expressions/list';
import { LocalExpression } from './expressions/local';
import { MethodCallExpression } from './expressions/method-call';
import { OrExpression } from './expressions/or';
import { PropertyExpression } from './expressions/property';

export interface IExpressionVisitor<TResult, TContext> {
  visit(expression: IExpression, context: TContext): TResult;
}

export abstract class ExpressionVisitor<TResult, TContext> implements IExpressionVisitor<TResult, TContext> {
  visit(expression: IExpression, context: TContext): TResult {
    if (expression instanceof AndExpression)
      return this.visitAnd(expression, context);

    if (expression instanceof CastExpression)
      return this.visitCast(expression, context);

    if (expression instanceof ComparisonExpression)
      return this.visitComparison(expression, context);

    if (expression instanceof ConstantExpression)
      return this.visitConstant(expression, context);

    if (expression instanceof ListExpression)
      return this.visitList(expression, context);

    if (expression instanceof LocalExpression)
      return this.visitLocal(expression, context);

    if (expression instanceof MethodCallExpression)
      return this.visitMethodCall(expression, context);

    if (expression instanceof OrExpression)
      return this.visitOr(expression, context);

    if (expression instanceof PropertyExpression)
      return this.visitProperty(expression, context);

    throw new Error('Not supported.');
  }

  abstract visitAnd(expression: AndExpression, context: TContext): TResult;
  abstract visitCast(expression: CastExpression, context: TContext): TResult;
  abstract visitComparison(expression: ComparisonExpression, context: TContext): TResult;
  abstract visitConstant(expression: ConstantExpression, context: TContext): TResult;
  abstract visitList(expression: ListExpression, context: TContext): TResult;
  abstract visitLocal(expression: LocalExpression, context: TContext): TResult;
  abstract visitMethodCall(expression: MethodCallExpression, context: TContext): TResult;
  abstract visitOr(expression: OrExpression, context: TContext): TResult;
  abstract visitProperty(expression: PropertyExpression, context: TContext): TResult;
}
