import * as React from 'react';
import * as NQL from '../../nql';
import { IUser, asEntity, entityComparer } from '../../application';
import { ListQueryBuilder } from '../list-query-builder';

interface IUserQueryBuilderProps {
  users: IUser[];
  queryItem: string;
  query?: NQL.IExpression;
  onChange(query: NQL.IExpression, reset: boolean, done: boolean): void;
}

interface IUserQueryBuilderState {
}

export class UserQueryBuilder extends React.PureComponent<IUserQueryBuilderProps, IUserQueryBuilderState> {
  static canParseQuery(query: NQL.IExpression, queryItem: string): boolean {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'User');
  }

  render(): JSX.Element {
    return (
      <ListQueryBuilder items={this.props.users} keyForItem={(item: IUser) => item.id} titleForItem={(item: IUser) => item.name} query={this.props.query} queryItem={this.props.queryItem} queryItemType="User" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
}
