import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IUserRole, entityComparer, IApplication } from '../../application';
import { ServiceManager } from '../../services';
import { ArrayHelper } from '../../utilities/array-helper';
import { UserRoleViewSettings, IView, View } from '../user-role-view-settings';
import { UserRoleDetail } from '../user-role-detail';
import { UserRoleTable } from '../user-role-table';
import { MasterPage } from '../master-page';
import { CommandButton } from '../../framework/components/command-button';
import { Icon } from '../../framework/components/icon';
import { ILocalStorage } from '../../framework/storage';
import { IContextProvider, IContextManager, IContext } from '../../framework/context';
import { UserRoleType } from '../../modules/user-roles';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IUserRolesPageProps {
}

interface IUserRolesPageState {
  userRoles?: IUserRole[];
  selectedUserRole?: IUserRole;
  view?: IView;
}

export class UserRolesPage extends React.Component<IUserRolesPageProps, IUserRolesPageState> implements IContextProvider {
  private localStorage = ServiceManager.Instance.getService<ILocalStorage>('ILocalStorage');
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private userRoleDetailContainerRef: HTMLElement;

  constructor() {
    super();

    this.handleApplicationLoad = this.handleApplicationLoad.bind(this);
    this.handleApplicationUserRoleAdd = this.handleApplicationUserRoleAdd.bind(this);
    this.handleApplicationUserRoleUpdate = this.handleApplicationUserRoleUpdate.bind(this);
    this.handleApplicationUserRoleDelete = this.handleApplicationUserRoleDelete.bind(this);
    this.handleUserRoleViewSettingsChange = this.handleUserRoleViewSettingsChange.bind(this);
    this.handleUserRoleTableUserRoleSelect = this.handleUserRoleTableUserRoleSelect.bind(this);

    this.state = {
      userRoles: [],
      view: View.create(),
    };
  }

  componentWillMount(): void {
    this.contextManager.registerContextProvider(this);
    this.application.on('load', this.handleApplicationLoad);
    this.application.userRoles.on('userRole.add', this.handleApplicationUserRoleAdd);
    this.application.userRoles.on('userRole.update', this.handleApplicationUserRoleUpdate);
    this.application.userRoles.on('userRole.delete', this.handleApplicationUserRoleDelete);
  }

  async componentDidMount(): Promise<void> {
    ($(this.userRoleDetailContainerRef) as any).sticky({
      topSpacing: 10,
    });

    const view = View.fromJSON(await this.localStorage.get('userRoles.view', View.create().toJSON()));

    this.setState({
      view: view,
    });

    this.loadUserRoles(view.filterExpression, view.sortExpressions);
  }

  componentWillUnmount(): void {
    this.application.userRoles.off('userRole.delete', this.handleApplicationUserRoleDelete);
    this.application.userRoles.off('userRole.update', this.handleApplicationUserRoleUpdate);
    this.application.userRoles.off('userRole.add', this.handleApplicationUserRoleAdd);
    this.application.off('load', this.handleApplicationLoad);
    this.contextManager.unregisterContextProvider(this);
  }

  private loadUserRoles(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): void {
    sortExpressions = [
      new NQL.SortExpression(new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('user'), 'name'), 'String')),
      new NQL.SortExpression(new NQL.LocalExpression('role')),
      new NQL.SortExpression(new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('project'), 'name'), 'String')),
    ];
    const userRoles = this.application.userRoles.getAll(filterExpression, sortExpressions);

    let selectedUserRole = this.state.selectedUserRole ? _.find(userRoles, _.partial(entityComparer, this.state.selectedUserRole)) : null;

    if (!selectedUserRole)
      selectedUserRole = userRoles[0];

    this.setState({
      userRoles: userRoles,
      selectedUserRole: selectedUserRole,
    });
  }

  getContext(): IContext {
    if (!this.state.selectedUserRole)
      return null;

    return {
      'core.activeItemType': UserRoleType,
      'core.activeItem': this.state.selectedUserRole,
    };
  }

  private handleApplicationLoad(): void {
    this.loadUserRoles(this.state.view.filterExpression, this.state.view.sortExpressions);
  }

  private handleApplicationUserRoleAdd({ userRole }: { userRole: IUserRole }): void {
    this.setState(state => {
      return {
        userRoles: [userRole, ...state.userRoles],
        selectedUserRole: userRole,
      };
    });
  }

  private handleApplicationUserRoleUpdate({ userRole }: { userRole: IUserRole }): void {
    this.setState(state => {
      return {
        userRoles: ArrayHelper.replaceElement(state.userRoles, userRole, userRole, entityComparer),
        selectedUserRole: userRole,
      };
    });
  }

  private handleApplicationUserRoleDelete({ userRole }: { userRole: IUserRole }): void {
    this.setState(state => {
      return {
        userRoles: ArrayHelper.removeElement(state.userRoles, userRole, entityComparer),
        selectedUserRole: undefined,
      };
    });
  }

  private handleUserRoleViewSettingsChange(view: IView): void {
    this.localStorage.set('userRoles.view', view.toJSON());

    this.setState({
      view: view,
    });

    this.loadUserRoles(view.filterExpression, view.sortExpressions);
  }

  private handleUserRoleTableUserRoleSelect(userRole: IUserRole): void {
    this.setState({
      selectedUserRole: userRole,
    });
  }

  render(): JSX.Element {
    return (
      <MasterPage>
        <div className="user-roles-page-component">
          <div className="action-bar">
            <CommandButton commandId="new-user-role"><Icon name="plus" position="before" /> New User Role</CommandButton>
            <CommandButton commandId="refresh" type="secondary"><Icon name="refresh" /></CommandButton>
          </div>
          <div className="view-settings row">
            <UserRoleViewSettings view={this.state.view} onChange={this.handleUserRoleViewSettingsChange} />
          </div>
          <div className="user-roles row">
            <div className="user-role-list">
              <UserRoleTable userRoles={this.state.userRoles} selectedUserRole={this.state.selectedUserRole} onUserRoleSelect={this.handleUserRoleTableUserRoleSelect} />
            </div>
            <div className="divider"></div>
            <div className="user-role-detail">
              <div className="user-role-detail-container" ref={e => this.userRoleDetailContainerRef = e}>
              {
                this.state.selectedUserRole &&
                  <UserRoleDetail userRole={this.state.selectedUserRole} />
              }
              </div>
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
}
