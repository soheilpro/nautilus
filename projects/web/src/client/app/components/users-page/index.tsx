import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IUser, entityComparer, IApplication } from '../../application';
import { ServiceManager } from '../../services';
import { ArrayHelper } from '../../utilities/array-helper';
import { UserViewSettings, IView, View } from '../user-view-settings';
import { UserDetail } from '../user-detail';
import { UserTable } from '../user-table';
import { MasterPage } from '../master-page';
import { CommandButton } from '../../framework/components/command-button';
import { Icon } from '../../framework/components/icon';
import { ILocalStorage } from '../../framework/storage';
import { IContextProvider, IContextManager, IContext } from '../../framework/context';
import { UserType } from '../../modules/users';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IUsersPageProps {
}

interface IUsersPageState {
  users?: IUser[];
  selectedUser?: IUser;
  view?: IView;
}

export class UsersPage extends React.Component<IUsersPageProps, IUsersPageState> implements IContextProvider {
  private localStorage = ServiceManager.Instance.getService<ILocalStorage>('ILocalStorage');
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private userDetailContainerRef: HTMLElement;

  constructor() {
    super();

    this.handleApplicationLoad = this.handleApplicationLoad.bind(this);
    this.handleApplicationUserAdd = this.handleApplicationUserAdd.bind(this);
    this.handleApplicationUserUpdate = this.handleApplicationUserUpdate.bind(this);
    this.handleApplicationUserDelete = this.handleApplicationUserDelete.bind(this);
    this.handleUserViewSettingsChange = this.handleUserViewSettingsChange.bind(this);
    this.handleUserTableUserSelect = this.handleUserTableUserSelect.bind(this);

    this.state = {
      users: [],
      view: View.create(),
    };
  }

  componentWillMount(): void {
    this.contextManager.registerContextProvider(this);
    this.application.on('load', this.handleApplicationLoad);
    this.application.users.on('user.add', this.handleApplicationUserAdd);
    this.application.users.on('user.update', this.handleApplicationUserUpdate);
    this.application.users.on('user.delete', this.handleApplicationUserDelete);
  }

  async componentDidMount(): Promise<void> {
    ($(this.userDetailContainerRef) as any).sticky({
      topSpacing: 10,
    });

    const view = View.fromJSON(await this.localStorage.get('users.view', View.create().toJSON()));

    this.setState({
      view: view,
    });

    this.loadUsers(view.filterExpression, view.sortExpressions);
  }

  componentWillUnmount(): void {
    this.application.users.off('user.delete', this.handleApplicationUserDelete);
    this.application.users.off('user.update', this.handleApplicationUserUpdate);
    this.application.users.off('user.add', this.handleApplicationUserAdd);
    this.application.off('load', this.handleApplicationLoad);
    this.contextManager.unregisterContextProvider(this);
  }

  private loadUsers(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): void {
    sortExpressions = [new NQL.SortExpression(new NQL.LocalExpression('name'))];

    const users = this.application.users.getAll(filterExpression, sortExpressions);

    let selectedUser = this.state.selectedUser ? _.find(users, _.partial(entityComparer, this.state.selectedUser)) : null;

    if (!selectedUser)
      selectedUser = users[0];

    this.setState({
      users: users,
      selectedUser: selectedUser,
    });
  }

  getContext(): IContext {
    if (!this.state.selectedUser)
      return null;

    return {
      'core.activeItemType': UserType,
      'core.activeItem': this.state.selectedUser,
    };
  }

  private handleApplicationLoad(): void {
    this.loadUsers(this.state.view.filterExpression, this.state.view.sortExpressions);
  }

  private handleApplicationUserAdd({ user }: { user: IUser }): void {
    this.setState(state => {
      return {
        users: [user, ...state.users],
        selectedUser: user,
      };
    });
  }

  private handleApplicationUserUpdate({ user }: { user: IUser }): void {
    this.setState(state => {
      return {
        users: ArrayHelper.replaceElement(state.users, user, user, entityComparer),
        selectedUser: user,
      };
    });
  }

  private handleApplicationUserDelete({ user }: { user: IUser }): void {
    this.setState(state => {
      return {
        users: ArrayHelper.removeElement(state.users, user, entityComparer),
        selectedUser: undefined,
      };
    });
  }

  private handleUserViewSettingsChange(view: IView): void {
    this.localStorage.set('users.view', view.toJSON());

    this.setState({
      view: view,
    });

    this.loadUsers(view.filterExpression, view.sortExpressions);
  }

  private handleUserTableUserSelect(user: IUser): void {
    this.setState({
      selectedUser: user,
    });
  }

  render(): JSX.Element {
    return (
      <MasterPage>
        <div className="users-page-component">
          <div className="action-bar">
            <CommandButton commandId="new-user"><Icon name="plus" position="before" /> New User</CommandButton>
            <CommandButton commandId="refresh" type="secondary"><Icon name="refresh" /></CommandButton>
          </div>
          <div className="view-settings row">
            <UserViewSettings view={this.state.view} onChange={this.handleUserViewSettingsChange} />
          </div>
          <div className="users row">
            <div className="user-list">
              <UserTable users={this.state.users} selectedUser={this.state.selectedUser} onUserSelect={this.handleUserTableUserSelect} />
            </div>
            <div className="divider"></div>
            <div className="user-detail">
              <div className="user-detail-container" ref={e => this.userDetailContainerRef = e}>
              {
                this.state.selectedUser &&
                  <UserDetail user={this.state.selectedUser} />
              }
              </div>
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
}
