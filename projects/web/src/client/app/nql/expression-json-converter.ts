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

export interface IExpressionJSON {
  type: string;
  args: (IExpressionJSON | IExpressionJSON[] | string)[];
}

export class ExpressionJSONConverter extends ExpressionVisitor<IExpressionJSON, {}> {
  convert(expression: IExpression): IExpressionJSON {
    return this.visit(expression, null);
  }

  visitAnd(expression: AndExpression, context: {}): IExpressionJSON {
    return {
      type: 'And',
      args: [
        expression.children.map(e => this.visit(e, context)),
      ],
    };
  }

  visitCast(expression: CastExpression, context: {}): IExpressionJSON {
    return {
      type: 'Cast',
      args: [
        this.visit(expression.child, context),
        expression.type,
      ],
    };
  }

  visitComparison(expression: ComparisonExpression, context: {}): IExpressionJSON {
    return {
      type: 'Comparison',
      args: [
        this.visit(expression.left, context),
        this.visit(expression.right, context),
        expression.operator,
      ],
    };
  }

  visitConstant(expression: ConstantExpression, context: {}): IExpressionJSON {
    return {
      type: 'Constant',
      args: [
        expression.value,
        expression.type,
      ],
    };
  }

  visitList(expression: ListExpression, context: {}): IExpressionJSON {
    return {
      type: 'List',
      args: [
        expression.children.map(e => this.visit(e, context)),
      ],
    };
  }

  visitLocal(expression: LocalExpression, context: {}): IExpressionJSON {
    return {
      type: 'Local',
      args: [
        expression.name,
      ],
    };
  }

  visitMethodCall(expression: MethodCallExpression, context: {}): IExpressionJSON {
    return {
      type: 'MethodCall',
      args: [
        this.visit(expression.target, context),
        expression.name,
        expression.args.map(e => this.visit(e, context)),
      ],
    };
  }

  visitOr(expression: OrExpression, context: {}): IExpressionJSON {
    return {
      type: 'Or',
      args: [
        expression.children.map(e => this.visit(e, context)),
      ],
    };
  }

  visitProperty(expression: PropertyExpression, context: {}): IExpressionJSON {
    return {
      type: 'Property',
      args: [
        this.visit(expression.target, context),
        expression.name,
      ],
    };
  }

  parse(value: IExpressionJSON): IExpression {
    if (value.type === 'And')
      return new AndExpression(
        (value.args[0] as IExpressionJSON[]).map(o => this.parse(o))
      );

    if (value.type === 'Cast')
      return new CastExpression(
        this.parse(value.args[0] as IExpressionJSON),
        value.args[1] as string
      );

    if (value.type === 'Comparison')
      return new ComparisonExpression(
        this.parse(value.args[0] as IExpressionJSON),
        this.parse(value.args[1] as IExpressionJSON),
        value.args[2] as string
      );

    if (value.type === 'Constant')
      return new ConstantExpression(
        value.args[0] as any,
        value.args[1] as string
      );

    if (value.type === 'List')
      return new ListExpression(
        (value.args[0] as IExpressionJSON[]).map(o => this.parse(o))
      );

    if (value.type === 'Local')
      return new LocalExpression(
        value.args[0] as string
      );

    if (value.type === 'MethodCall')
      return new MethodCallExpression(
        this.parse(value.args[0] as IExpressionJSON),
        value.args[1] as string,
        (value.args[2] as IExpressionJSON[]).map(o => this.parse(o))
      );

    if (value.type === 'Or')
      return new OrExpression(
        (value.args[0] as IExpressionJSON[]).map(o => this.parse(o))
      );

    if (value.type === 'Property')
      return new PropertyExpression(
        this.parse(value.args[0] as IExpressionJSON),
        value.args[1] as string
      );

    throw new Error('Not supported.');
  }
}
