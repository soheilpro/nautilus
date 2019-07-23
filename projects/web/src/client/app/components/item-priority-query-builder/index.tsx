import * as React from 'react';
import * as NQL from '../../nql';
import { IItemPriority, asEntity, entityComparer } from '../../application';
import { ListQueryBuilder } from '../list-query-builder';

interface IItemPriorityQueryBuilderProps {
  itemPriorities: IItemPriority[];
  queryItem: string;
  query?: NQL.IExpression;
  onChange(query: NQL.IExpression, reset: boolean, done: boolean): void;
}

interface IItemPriorityQueryBuilderPriority {
}

export class ItemPriorityQueryBuilder extends React.PureComponent<IItemPriorityQueryBuilderProps, IItemPriorityQueryBuilderPriority> {
  static canParseQuery(query: NQL.IExpression, queryItem: string): boolean {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'ItemPriority');
  }

  render(): JSX.Element {
    return (
      <ListQueryBuilder items={this.props.itemPriorities} keyForItem={(item: IItemPriority) => item.id} titleForItem={(item: IItemPriority) => item.title} query={this.props.query} queryItem={this.props.queryItem} queryItemType="ItemPriority" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
}
