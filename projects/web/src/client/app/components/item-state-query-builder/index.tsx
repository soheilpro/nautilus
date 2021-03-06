import * as React from 'react';
import * as NQL from '../../nql';
import { IItemState, asEntity, entityComparer } from '../../application';
import { ListQueryBuilder } from '../list-query-builder';

interface IItemStateQueryBuilderProps {
  itemStates: IItemState[];
  queryItem: string;
  query?: NQL.IExpression;
  onChange(query: NQL.IExpression, reset: boolean, done: boolean): void;
}

interface IItemStateQueryBuilderState {
}

export class ItemStateQueryBuilder extends React.PureComponent<IItemStateQueryBuilderProps, IItemStateQueryBuilderState> {
  static canParseQuery(query: NQL.IExpression, queryItem: string): boolean {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'ItemState');
  }

  render(): JSX.Element {
    return (
      <ListQueryBuilder items={this.props.itemStates} keyForItem={(item: IItemState) => item.id} titleForItem={(item: IItemState) => item.title} query={this.props.query} queryItem={this.props.queryItem} queryItemType="ItemState" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
}
