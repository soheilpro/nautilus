import * as React from 'react';
import * as NQL from '../../nql';
import { IProject, IUser, IUserRole, IUserRoleChange, IApplication, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import { Window, WindowHeader, WindowContent, WindowActionBar } from '../../framework/components/window';
import { IFormError } from '../../framework/forms';
import { Icon } from '../../framework/components/icon';
import { UserSelect } from '../user-select';
import { RoleSelect } from '../role-select';
import { ProjectSelect } from '../project-select';
import { Button } from '../../framework/components/button';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IAddEditUserRoleWindowProps {
  mode: 'add' | 'edit';
  userRole?: IUserRole;
  onAdd?(userRole: IUserRole, window: AddEditUserRoleWindow): void;
  onUpdate?(userRoleChange: IUserRoleChange, window: AddEditUserRoleWindow): void;
  onClose(): void;
}

interface IAddEditUserRoleWindowState {
  users?: IUser[];
  roles?: string[];
  projects?: IProject[];
  user?: IUser;
  role?: string;
  project?: IProject;
  errors?: IFormError[];
}

export class AddEditUserRoleWindow extends React.PureComponent<IAddEditUserRoleWindowProps, IAddEditUserRoleWindowState> {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');

  constructor(props: IAddEditUserRoleWindowProps) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleUserSelectChange = this.handleUserSelectChange.bind(this);
    this.handleRoleSelectChange = this.handleRoleSelectChange.bind(this);
    this.handleProjectSelectChange = this.handleProjectSelectChange.bind(this);

    const state: IAddEditUserRoleWindowState = {
      users: [],
      roles: [],
      projects: [],
      errors: [],
    };

    if (props.userRole) {
      state.user = props.userRole.user;
      state.role = props.userRole.role;
      state.project = props.userRole.project;
    }

    this.state = state;
  }

  componentDidMount(): void {
    this.setState(state => {
      return {
        users: this.application.users.getAll(null, [new NQL.SortExpression(new NQL.LocalExpression('name'))]).filter(user => user.state === 'enabled' || (this.props.userRole && entityComparer(user, this.props.userRole.user))),
        roles: this.application.roles.getAll(),
        projects: this.application.projects.getAll(null, [new NQL.SortExpression(new NQL.LocalExpression('name'))]),
      };
    });
  }

  public showError(error: IFormError): void {
    this.setState({
      errors: [error],
    });
  }

  private handleFormSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    switch (this.props.mode) {
      case 'add':
        const userRole: IUserRole = {
          user: this.state.user || undefined,
          role: this.state.role || undefined,
          project: this.state.project || undefined,
        };

        this.props.onAdd(userRole, this);
        break;

      case 'edit':
        const userRoleChange: IUserRoleChange = {
          user: (this.state.user !== this.props.userRole.user ? this.state.user || null : undefined),
          role: (this.state.role !== this.props.userRole.role ? this.state.role || '' : undefined),
          project: (this.state.project !== this.props.userRole.project ? this.state.project || null : undefined),
        };

        this.props.onUpdate(userRoleChange, this);
        break;
    }
  }

  private handleUserSelectChange(value: IUser): void {
    this.setState({
      user: value,
    });
  }

  private handleRoleSelectChange(value: string): void {
    this.setState({
      role: value,
    });
  }

  private handleProjectSelectChange(value: IProject): void {
    this.setState({
      project: value,
    });
  }

  render(): JSX.Element {
    return (
      <Window className="add-edit-user-role-window-component">
        <WindowHeader>
          { this.props.mode === 'add' && 'New User Role' }
          { this.props.mode === 'edit' && `Edit User Role` }
        </WindowHeader>
        <WindowContent>
        <div className="errors">
            {
              this.state.errors.map((error, index) => {
                return (
                  <div className="error-container" key={index}>
                    <div className="error">
                      <Icon name="exclamation" className="icon" />
                      {error.message}
                    </div>
                  </div>
                );
              })
            }
          </div>
          <form className="form" id="addEditUserRoleForm" onSubmit={this.handleFormSubmit}>
            <div className="field">
              <div className="label">
                User:
              </div>
              <div className="value">
                <UserSelect className="user" users={this.state.users} user={this.state.user} onChange={this.handleUserSelectChange} />
              </div>
              <div className="hint">
              </div>
            </div>
            <div className="field">
              <div className="label">
                Role:
              </div>
              <div className="value">
                <RoleSelect className="role" roles={this.state.roles} role={this.state.role} onChange={this.handleRoleSelectChange} />
              </div>
            </div>
            {
              this.state.role && this.state.role.indexOf('project.') === 0 ?
                <div className="field">
                  <div className="label">
                    Project:
                  </div>
                  <div className="value">
                    <ProjectSelect className="project" projects={this.state.projects} project={this.state.project} onChange={this.handleProjectSelectChange} />
                  </div>
                </div>
                : null
            }
          </form>
        </WindowContent>
        <WindowActionBar>
          {
            this.props.mode === 'add' &&
              <Button type="submit" form="addEditUserRoleForm">Add User Role</Button>
          }
          {
            this.props.mode === 'edit' &&
              <Button type="submit" form="addEditUserRoleForm">Update User Role</Button>
          }
          <Button type="secondary" onClick={this.props.onClose}>Cancel</Button>
        </WindowActionBar>
      </Window>
    );
  }
}
