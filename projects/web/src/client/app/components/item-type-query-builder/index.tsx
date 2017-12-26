import * as React from 'react';
import * as NQL from '../../nql';
import { IItemType, asEntity, entityComparer } from '../../application';
import ListQueryBuilder from '../list-query-builder';

interface IItemTypeQueryBuilderProps {
  itemTypes: IItemType[];
  queryItem: string;
  query?: NQL.IExpression;
  onChange(query: NQL.IExpression, reset: boolean, done: boolean): void;
}

interface IItemTypeQueryBuilderState {
}

export default class ItemTypeQueryBuilder extends React.PureComponent<IItemTypeQueryBuilderProps, IItemTypeQueryBuilderState> {
  static canParseQuery(query: NQL.IExpression, queryItem: string): boolean {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'ItemType');
  }

  render(): JSX.Element {
    return (
      <ListQueryBuilder items={this.props.itemTypes} displayProperty="title" query={this.props.query} queryItem={this.props.queryItem} queryItemType="ItemType" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
