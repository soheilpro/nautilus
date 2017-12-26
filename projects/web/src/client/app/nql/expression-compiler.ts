import { AndExpression } from './expressions/and';
import { CastExpression } from './expressions/cast';
import { ComparisonExpression } from './expressions/comparison';
import { ConstantExpression } from './expressions/constant';
import { ExpressionVisitor } from './expression-visitor';
import { IExpression } from './iexpression';
import { IType } from './itype';
import { ListExpression } from './expressions/list';
import { LocalExpression } from './expressions/local';
import { MethodCallExpression } from './expressions/method-call';
import { OrExpression } from './expressions/or';
import { PropertyExpression } from './expressions/property';
import TypeSystem from './type-system';

interface IContext {
}

export class ExpressionCompiler extends ExpressionVisitor<any, IContext> {
  private typeSystem = new TypeSystem();

  constructor(types: IType[]) {
    super();

    this.typeSystem.registerTypes(types);
  }

  compile(expression: IExpression, args: string[]): Function {
    const context: IContext = {};

    return new Function(...args, `return ${this.visit(expression, context)};`);
  }

  visitAnd(expression: AndExpression, context: IContext): string {
    return expression.children.map(child => `(${this.visit(child, context)})`).join(' && ');
  }

  visitCast(expression: CastExpression, context: IContext): string {
    return this.visit(expression.child, context);
  }

  visitComparison(expression: ComparisonExpression, context: IContext): string {
    switch (expression.operator) {
      case 'eq':
      case 'neq':
        return this.visitComparisonEquality(expression.left, expression.right, expression.operator, context);

      case 'in':
      case 'nin':
        return this.visitComparisonInclusion(expression.left, expression.right, expression.operator, context);

      default:
        throw new Error('Not supported.');
    }
  }

  private visitComparisonEquality(left: IExpression, right: IExpression, operator: string, context: IContext): string {
    const leftReturnType = this.typeSystem.getType(left.returnType);
    const rightReturnType = this.typeSystem.getType(right.returnType);

    if (!leftReturnType)
      throw new Error(`Unkown type '${left.returnType}'.`);

    if (!rightReturnType)
      throw new Error(`Unkown type '${right.returnType}'.`);

    const commonReturnType = this.typeSystem.getCommonType(leftReturnType, rightReturnType);

    if (!commonReturnType)
      throw new Error(`Cannot compare expressions of type '${leftReturnType}' and '${rightReturnType}'.`);

    const leftValue = this.visit(left, context);
    const rightValue = this.visit(right, context);
    const operatorValue = this.javaScriptOperatorFromComparisonOperator(operator);

    if (this.typeSystem.isOfType(commonReturnType, 'Entity')) {
      switch (operator) {
        case 'eq':
          return `${leftValue} && ${rightValue} && (${leftValue}).id ${operatorValue} (${rightValue}).id`;

        case 'neq':
          return `!(${leftValue}) || !(${rightValue}) || (${leftValue}).id ${operatorValue} (${rightValue}).id`;

        default:
          throw new Error('Not supported.');
      }
    }

    return `${leftValue} ${operatorValue} ${rightValue}`;
  }

  private javaScriptOperatorFromComparisonOperator(operator: string): string {
      if (operator === 'eq')
        return '===';

      if (operator === 'neq')
        return '!==';

      throw new Error('Not supported.');
  }

  private visitComparisonInclusion(left: IExpression, right: IExpression, operator: string, context: IContext): string {
    const leftReturnType = this.typeSystem.getType(left.returnType);

    if (!leftReturnType)
      throw new Error(`Unkown type '${left.returnType}'.`);

    if (!(right instanceof ListExpression))
        throw new Error(`${operator} operator expects a List.`);

    switch (operator) {
      case 'in':
        return right.children.map(child => `(${this.visitComparisonEquality(left, child, 'eq', context)})`).join(' || ');

      case 'nin':
        return right.children.map(child => `(${this.visitComparisonEquality(left, child, 'neq', context)})`).join(' && ');

      default:
        throw new Error('Not supported.');
    }
  }

  visitConstant(expression: ConstantExpression, context: IContext): string {
    return JSON.stringify(expression.value);
  }

  visitList(expression: ListExpression, context: IContext): string {
    return `[${expression.children.map(e => `(${this.visit(e, context)})`)}]`;
  }

  visitLocal(expression: LocalExpression, context: IContext): string {
    return expression.name;
  }

  visitMethodCall(expression: MethodCallExpression, context: IContext): string {
    const target = this.visit(expression.target, context);
    const name = expression.name;
    const args = expression.args.map(e => this.visit(e, context));

    return `(${target}).${name}(${args.join(',')})`;
  }

  visitOr(expression: OrExpression, context: IContext): string {
    return expression.children.map(child => `(${this.visit(child, context)})`).join(' || ');
  }

  visitProperty(expression: PropertyExpression, context: IContext): string {
    const target = this.visit(expression.target, context);
    const name = expression.name;

    return `(${target}).${name}`;
  }
}
