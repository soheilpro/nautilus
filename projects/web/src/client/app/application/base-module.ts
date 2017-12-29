import * as NQL from '../nql';
import EventEmitter = require('wolfy87-eventemitter');
import { IModule } from './imodule';
import { Query } from './query';

export abstract class BaseModule extends EventEmitter implements IModule {
  load(): Promise<void> {
    return Promise.resolve();
  }

  protected filter<T>(items: T[], expression: NQL.IExpression, expressionNormalizer: NQL.ExpressionTransformer<{}>): T[] {
    const predicate = new Query().getPredicate<T>(expressionNormalizer.transform(expression, null));

    return items = items.filter(predicate);
  }

  protected sort<T>(items: T[], sortExpressions: NQL.ISortExpression[], expressionNormalizer: NQL.ExpressionTransformer<{}>): T[] {
    const query = new Query();

    const newSortExpressions = sortExpressions.map(sortExpression => {
      return {
        compare: query.getComparer<T>(expressionNormalizer.transform(sortExpression.expression, null)),
        order: sortExpression.order,
      };
    });

    return items.sort((item1, item2) => {
      for (const sortExpression of newSortExpressions) {
        const result = sortExpression.compare(item1, item2);

        if (result !== 0)
          return sortExpression.order * result;
      }

      return 0;
    });
  }
}
