import * as React from 'react';
import * as NQL from '../../nql';
import { IItemState, asEntity, entityComparer } from '../../application';
import ListQueryBuilder from '../list-query-builder';

interface IItemStateQueryBuilderProps {
  itemStates: IItemState[];
  queryItem: string;
  query?: NQL.IExpression;
  onChange(query: NQL.IExpression, reset: boolean, done: boolean): void;
}

interface IItemStateQueryBuilderState {
}

export default class ItemStateQueryBuilder extends React.PureComponent<IItemStateQueryBuilderProps, IItemStateQueryBuilderState> {
  static canParseQuery(query: NQL.IExpression, queryItem: string): boolean {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'ItemState');
  }

  render(): JSX.Element {
    return (
      <ListQueryBuilder items={this.props.itemStates} displayProperty="title" query={this.props.query} queryItem={this.props.queryItem} queryItemType="ItemState" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
}
