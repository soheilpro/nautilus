import * as React from 'react';
import * as NQL from '../../nql';
import { IRole, valueComparer } from '../../application';
import { ListQueryBuilder } from '../list-query-builder';

interface IRoleQueryBuilderProps {
  roles: IRole[];
  queryItem: IRole;
  query?: NQL.IExpression;
  onChange(query: NQL.IExpression, reset: boolean, done: boolean): void;
}

interface IRoleQueryBuilderState {
}

export class RoleQueryBuilder extends React.PureComponent<IRoleQueryBuilderProps, IRoleQueryBuilderState> {
  static canParseQuery(query: NQL.IExpression, queryItem: IRole): boolean {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'Role');
  }

  render(): JSX.Element {
    return (
      <ListQueryBuilder items={this.props.roles} itemKeyGetter={(item: IRole) => item} itemTitleGetter={(item: IRole) => item} query={this.props.query} queryItem={this.props.queryItem} queryItemType="Role" itemToQueryItem={(item: IRole) => item} itemComparer={valueComparer} onChange={this.props.onChange} />
    );
  }
}
