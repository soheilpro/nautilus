import * as React from 'react';
import * as NQL from '../../nql';
import { IProject, asEntity, entityComparer } from '../../application';
import { ListQueryBuilder } from '../list-query-builder';

interface IProjectQueryBuilderProps {
  projects: IProject[];
  queryItem: string;
  query?: NQL.IExpression;
  onChange(query: NQL.IExpression, reset: boolean, done: boolean): void;
}

interface IProjectQueryBuilderState {
}

export class ProjectQueryBuilder extends React.PureComponent<IProjectQueryBuilderProps, IProjectQueryBuilderState> {
  static canParseQuery(query: NQL.IExpression, queryItem: string): boolean {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'Project');
  }

  render(): JSX.Element {
    return (
      <ListQueryBuilder items={this.props.projects} itemKeyGetter={(item: IProject) => item.id} itemTitleGetter={(item: IProject) => item.name} query={this.props.query} queryItem={this.props.queryItem} queryItemType="Project" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
}
