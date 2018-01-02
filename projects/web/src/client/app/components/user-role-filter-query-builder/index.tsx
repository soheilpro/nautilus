import * as React from 'react';
import * as NQL from '../../nql';
import { IProject, IUser, IApplication } from '../../application';
import { ServiceManager } from '../../services';
import { AndQueryBuilder, IQueryBuilder } from '../and-query-builder';
import { ProjectQueryBuilder } from '../project-query-builder';
import { RoleQueryBuilder } from '../role-query-builder';
import { UserQueryBuilder } from '../user-query-builder';

interface IUserRoleFilterQueryBuilderProps {
  query: NQL.IExpression;
  onChange(query: NQL.IExpression): void;
}

interface IUserRoleFilterQueryBuilderState {
  users?: IUser[];
  roles?: string[];
  projects?: IProject[];
}

export class UserRoleFilterQueryBuilder extends React.PureComponent<IUserRoleFilterQueryBuilderProps, IUserRoleFilterQueryBuilderState> {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private andQueryBuilderRef: AndQueryBuilder;

  constructor() {
    super();

    this.state = {
      users: [],
      roles: [],
      projects: [],
    };
  }

  componentDidMount(): void {
    this.setState({
      users: this.application.users.getAll(null, [new NQL.SortExpression(new NQL.LocalExpression('username'))]),
      roles: this.application.roles.getAll(),
      projects: this.application.projects.getAll(null, [new NQL.SortExpression(new NQL.LocalExpression('name'))]),
    });
  }

  open(key: string): void {
    this.andQueryBuilderRef.open(key);
  }

  render(): JSX.Element {
    const queryBuilders: IQueryBuilder[] = [
      { key: 'user',    title: 'User',    queryItem: 'user',    Component: UserQueryBuilder,    props: { users: this.state.users } },
      { key: 'role',    title: 'Role',    queryItem: 'role',    Component: RoleQueryBuilder,    props: { roles: this.state.roles } },
      { key: 'project', title: 'Project', queryItem: 'project', Component: ProjectQueryBuilder, props: { projects: this.state.projects } },
    ];

    return (
      <AndQueryBuilder queryBuilders={queryBuilders} query={this.props.query} onChange={this.props.onChange} ref={e => this.andQueryBuilderRef = e} />
    );
  }
}
