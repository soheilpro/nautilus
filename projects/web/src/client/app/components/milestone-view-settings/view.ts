import * as uuid from 'uuid';
import * as NQL from '../../nql';
import { IView } from './iview';

export class View implements IView {
  id: string;
  name: string;
  filterExpression: NQL.IExpression;
  sortExpressions: NQL.ISortExpression[];

  isDefault() {
    return !this.filterExpression;
  }

  toJSON() {
    const expressionObjectConverter = new NQL.ExpressionJSONConverter();

    return {
      id: this.id,
      name: this.name,
      filterExpression: this.filterExpression ? expressionObjectConverter.convert(this.filterExpression) : undefined,
    };
  }

  static fromJSON(json: any) {
    const expressionObjectConverter = new NQL.ExpressionJSONConverter();

    const view = new View();
    view.id = json.id;
    view.name = json.name;
    view.filterExpression = json.filterExpression ? expressionObjectConverter.parse(json.filterExpression) : undefined;

    return view;
  }

  static create({ name, filterExpression }: { name?: string, filterExpression?: NQL.IExpression } = {}) {
    const view = new View();
    view.id = uuid().replace(/-/g, '');
    view.name = name;
    view.filterExpression = filterExpression;

    return view;
  }
}
