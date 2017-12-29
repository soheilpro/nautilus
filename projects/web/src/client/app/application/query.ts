import * as NQL from '../nql';

export class Query {
  private types =  [
    { name: 'ItemState',    base: 'Entity' },
    { name: 'ItemType',     base: 'Entity' },
    { name: 'Milestone',    base: 'Entity' },
    { name: 'Project',      base: 'Entity' },
    { name: 'User',         base: 'Entity' },
  ];

  getPredicate<T>(query: NQL.IExpression): (item: T) => boolean {
    const compiler = new NQL.ExpressionCompiler(this.types);

    return compiler.compile(query, ['item']) as (item: T) => boolean;
  }

  getComparer<T>(query: NQL.IExpression): (item1: T, item2: T) => number {
    const compiler = new NQL.ExpressionCompiler(this.types);
    const func = compiler.compile(query, ['item']);

    if (query.returnType === 'Number') {
      return (item1, item2): number => {
        const result1 = func(item1) || 0;
        const result2 = func(item2) || 0;

        return result1 - result2;
      };
    }

    if (query.returnType === 'String') {
      return (item1, item2): number => {
        const result1 = func(item1) || '';
        const result2 = func(item2) || '';

        return result1.localeCompare(result2);
      };
    }

    throw new Error('Not supported.');
  }
}

