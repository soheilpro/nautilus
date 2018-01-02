import { IExpression } from './iexpression';
import { ExpressionVisitor } from './expression-visitor';
import { AndExpression } from './expressions/and';
import { CastExpression } from './expressions/cast';
import { ComparisonExpression } from './expressions/comparison';
import { ConstantExpression } from './expressions/constant';
import { ListExpression } from './expressions/list';
import { LocalExpression } from './expressions/local';
import { MethodCallExpression } from './expressions/method-call';
import { OrExpression } from './expressions/or';
import { PropertyExpression } from './expressions/property';

export class ExpressionTransformer<TContext> extends ExpressionVisitor<IExpression, TContext> {
  transform(expression: IExpression, context: TContext): IExpression {
    return this.visit(expression, context);
  }

  visitAnd(expression: AndExpression, context: TContext): IExpression {
    return new AndExpression(expression.children.map(e => this.visit(e, context)));
  }

  visitCast(expression: CastExpression, context: TContext): IExpression {
    return new CastExpression(this.visit(expression.child, context), expression.type);
  }

  visitComparison(expression: ComparisonExpression, context: TContext): IExpression {
    return new ComparisonExpression(this.visit(expression.left, context), this.visit(expression.right, context), expression.operator);
  }

  visitConstant(expression: ConstantExpression, context: TContext): IExpression {
    return new ConstantExpression(expression.value, expression.type);
  }

  visitList(expression: ListExpression, context: TContext): IExpression {
    return new ListExpression(expression.children.map(e => this.visit(e, context)));
  }

  visitLocal(expression: LocalExpression, context: TContext): IExpression {
    return new LocalExpression(expression.name);
  }

  visitMethodCall(expression: MethodCallExpression, context: TContext): IExpression {
    return new MethodCallExpression(this.visit(expression.target, context), expression.name, expression.args.map(e => this.visit(e, context)));
  }

  visitOr(expression: OrExpression, context: TContext): IExpression {
    return new OrExpression(expression.children.map(e => this.visit(e, context)));
  }

  visitProperty(expression: PropertyExpression, context: TContext): IExpression {
    return new PropertyExpression(this.visit(expression.target, context), expression.name);
  }
}
