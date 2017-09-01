import * as NQL from '../../nql';
import { IApplication } from '../../application';

export default class HTMLExpressionFormatter extends NQL.ExpressionVisitor<string, {}> {
  constructor(private application: IApplication) {
    super();
  }

  format(expression: NQL.IExpression, context: {}) {
    return this.visit(expression, context);
  }

  visitAnd(expression: NQL.AndExpression, context: {}) {
    return `<span class="expression expression-and">${expression.children.map(e => {
      if (e instanceof NQL.OrExpression)
        return `(${this.visit(e, context)})`;

      return this.visit(e, context);
    }).join(' <span class="expression-and-operator">AND</span> ')}</span>`;
  }

  visitCast(expression: NQL.CastExpression, context: {}) {
    return `<span class="expression expression-cast">(${expression.type})(${this.visit(expression.child, context)})<span>`;
  }

  visitComparison(expression: NQL.ComparisonExpression, context: {}) {
    return `<span class="expression expression-comparison expression-comparison-operator-${expression.operator}">${this.visit(expression.left, context)} <span class="expression-comparison-operator">${this.titleForComparisonOperator(expression.operator)}</span> ${this.visit(expression.right, context)}</span>`;
  }

  visitConstant(expression: NQL.ConstantExpression, context: {}) {
    return `<span class="expression expression-constant"><span class="${expression.type.toLowerCase()}">${this.titleForConstant(expression)}</span></span>`;
  }

  visitList(expression: NQL.ListExpression, context: {}) {
    return `<span class="expression expression-list">[${expression.children.map(e => this.visit(e, context)).join(', ')}]</span>`;
  }

  visitLocal(expression: NQL.LocalExpression, context: {}) {
    return `<span class="expression expression-local">${expression.name}</span>`;
  }

  visitMethodCall(expression: NQL.MethodCallExpression, context: {}) {
    return `<span class="expression expression-method-call">${this.visit(expression.target, context)}.${expression.name}(${expression.args.map(e => this.visit(e, context)).join(',')})</span>`;
  }

  visitOr(expression: NQL.OrExpression, context: {}) {
    return `<span class="expression expression-or">${expression.children.map(e => {
      if (e instanceof NQL.AndExpression)
        return `(${this.visit(e, context)})`;

      return this.visit(e, context);
    }).join(' <span class="expression-or-operator">OR</span> ')}</span>`;
  }

  visitProperty(expression: NQL.PropertyExpression, context: {}) {
    return `<span class="expression expression-property">${this.visit(expression.target, context)}.${expression.name}</span>`;
  }

  private titleForComparisonOperator(operator: string) {
    if (operator === 'eq')
      return '=';

    if (operator === 'neq')
      return '!=';

    if (operator === 'in')
      return 'in';

    if (operator === 'nin')
      return 'not in';

    throw new Error('Not supported.');
  }

  private titleForConstant(expression: NQL.ConstantExpression) {
    if (expression.type === 'User')
      return this.application.users.get(expression.value).name;

    if (expression.type === 'Project')
      return this.application.projects.get(expression.value).name;

    if (expression.type === 'ItemType')
      return this.application.itemTypes.get(expression.value).title;

    if (expression.type === 'ItemState')
      return this.application.itemStates.get(expression.value).title;

    if (expression.type === 'Milestone')
      return this.application.items.getMilestone(expression.value).fullTitle;

    throw new Error('Not supported.');
  }
}
