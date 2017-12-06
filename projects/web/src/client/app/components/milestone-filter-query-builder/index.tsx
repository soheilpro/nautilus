import * as React from 'react';
import * as NQL from '../../nql';
import { IProject, IItemState, IUser, IApplication } from '../../application';
import { ServiceManager } from '../../services';
import AndQueryBuilder, { IQueryBuilder } from '../and-query-builder';
import ProjectQueryBuilder from '../project-query-builder';
import ItemStateQueryBuilder from '../item-state-query-builder';
import UserQueryBuilder from '../user-query-builder';

interface IMilestoneFilterQueryBuilderProps {
  query: NQL.IExpression;
  onChange(query: NQL.IExpression): void;
}

interface IMilestoneFilterQueryBuilderState {
  projects?: IProject[];
  itemStates?: IItemState[];
  users?: IUser[];
}

export default class MilestoneFilterQueryBuilder extends React.PureComponent<IMilestoneFilterQueryBuilderProps, IMilestoneFilterQueryBuilderState> {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private andQueryBuilderComponent: AndQueryBuilder;

  constructor() {
    super();

    this.state = {
      projects: [],
      itemStates: [],
      users: [],
    };
  }

  componentDidMount() {
    this.setState({
      projects: this.application.projects.getAll(),
      itemStates: this.application.itemStates.getAll('milestone'),
      users: this.application.users.getAll(),
    });
  }

  open(key: string) {
    this.andQueryBuilderComponent.open(key);
  }

  render() {
    const queryBuilders: IQueryBuilder[] = [
      { key: 'project',    title: 'Project',     queryItem: 'project',    Component: ProjectQueryBuilder,      props: { projects: this.state.projects } },
      { key: 'state',      title: 'State',       queryItem: 'state',      Component: ItemStateQueryBuilder,    props: { itemStates: this.state.itemStates } },
      { key: 'createdBy',  title: 'Created By',  queryItem: 'createdBy',  Component: UserQueryBuilder,         props: { users: this.state.users } },
    ];

    return (
      <AndQueryBuilder queryBuilders={queryBuilders} query={this.props.query} onChange={this.props.onChange} ref={e => this.andQueryBuilderComponent = e} />
    );
  }
};
