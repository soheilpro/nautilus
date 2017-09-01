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

interface ILocals {
  [key: string]: any;
}

export interface IInterpretationContext {
  locals: ILocals;
}

export class ExpressionInterpreter extends ExpressionVisitor<any, IInterpretationContext> {
  private typeSystem = new TypeSystem();

  constructor(types: IType[]) {
    super();

    this.typeSystem.registerTypes(types);
  }

  evaluate(expression: IExpression, locals: ILocals) {
    const context: IInterpretationContext = {
      locals
    };

    return this.visit(expression, context);
  }

  visitAnd(expression: AndExpression, context: IInterpretationContext) {
    for (const child of expression.children)
      if (!this.visit(child, context))
        return false;

    return true;
  }

  visitCast(expression: CastExpression, context: IInterpretationContext) {
    return this.visit(expression.child, context);
  }

  visitComparison(expression: ComparisonExpression, context: IInterpretationContext) {
    const areEqual = (left: IExpression, right: IExpression) => {
      const leftReturnType = this.typeSystem.getType(expression.left.returnType);
      const rightReturnType = this.typeSystem.getType(expression.right.returnType);

      if (!leftReturnType)
        throw new Error(`Unkown type '${left.returnType}'.`);

      if (!rightReturnType)
        throw new Error(`Unkown type '${right.returnType}'.`);

      const commonReturnType = this.typeSystem.getCommonType(leftReturnType, rightReturnType);

      if (!commonReturnType)
        throw new Error(`Cannot compare expressions of type '${leftReturnType}' and '${rightReturnType}'.`);

      const leftValue = this.visit(expression.left, context);
      const rightValue = this.visit(expression.right, context);

      if (commonReturnType.name === 'Boolean')
        return leftValue === rightValue;

      if (commonReturnType.name === 'Number')
        return leftValue === rightValue;

      if (commonReturnType.name === 'String')
        return leftValue === rightValue;

      const entityType = this.typeSystem.getType('Entity');

      if (this.typeSystem.isOfType(commonReturnType, entityType))
        return leftValue && rightValue && leftValue.id === rightValue.id;

      return false;
    };

    const isIn = (left: IExpression, right: IExpression) => {
      const rightReturnType = right.returnType;

      if (rightReturnType !== 'List')
        throw new Error(`in/nin operators expect a List but got '${rightReturnType}' instead.`);

      return (right as ListExpression).children.some(e => areEqual(left, e));
    };

    switch (expression.operator) {
      case 'eq':
        return areEqual(expression.left, expression.right);

      case 'neq':
        return !areEqual(expression.left, expression.right);

      case 'in':
        return isIn(expression.left, expression.right);

      case 'nin':
        return !isIn(expression.left, expression.right);

      default:
        throw new Error('Not supported.');
    }
  }

  visitConstant(expression: ConstantExpression, context: IInterpretationContext) {
    return expression.value;
  }

  visitList(expression: ListExpression, context: IInterpretationContext) {
    return expression.children.map(e => this.visit(e, context));
  }

  visitLocal(expression: LocalExpression, context: IInterpretationContext) {
    return context.locals[expression.name];
  }

  visitMethodCall(expression: MethodCallExpression, context: IInterpretationContext) {
    const targetValue = this.visit(expression.target, context);
    const argValues = expression.args.map(e => this.visit(e, context));

    return targetValue[expression.name].call(targetValue, argValues);
  }

  visitOr(expression: OrExpression, context: IInterpretationContext) {
    for (const child of expression.children)
      if (this.visit(child, context))
        return true;

    return false;
  }

  visitProperty(expression: PropertyExpression, context: IInterpretationContext) {
    const targetValue = this.visit(expression.target, context);

    return targetValue[expression.name];
  }
}
