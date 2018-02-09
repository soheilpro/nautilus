import * as React from 'react';
import * as NQL from '../../nql';
import { IProject, asEntity, entityComparer } from '../../application';
import ListQueryBuilder from '../list-query-builder';

interface IProjectQueryBuilderProps {
  projects: IProject[];
  queryItem: string;
  query?: NQL.IExpression;
  onChange(query: NQL.IExpression, reset: boolean, done: boolean): void;
}

interface IProjectQueryBuilderState {
}

export default class ProjectQueryBuilder extends React.PureComponent<IProjectQueryBuilderProps, IProjectQueryBuilderState> {
  static canParseQuery(query: NQL.IExpression, queryItem: string) {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'Project');
  }

  render() {
    return (
      <ListQueryBuilder items={this.props.projects} displayProperty="name" query={this.props.query} queryItem={this.props.queryItem} queryItemType="Project" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
