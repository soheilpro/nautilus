import * as _ from 'underscore';
import * as React from 'react';
import { ServiceManager } from '../../services';
import { IApplication } from '../../application';
import { ICommandProvider, ICommand, ICommandManager } from '../../framework/commands';
import { ITabController, ITab } from '../../framework/tabs';
import { NavLink } from 'react-router-dom';
import { Icon } from '../../framework/components/icon';
import { CloseTabCommand } from './commands';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface INavigationProps {
}

interface INavigationState {
  isAdmin: boolean;
}

export class Navigation extends React.Component<INavigationProps, INavigationState> implements ICommandProvider {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private tabController = ServiceManager.Instance.getService<ITabController>('ITabController');

  constructor() {
    super();

    this.forceUpdate = this.forceUpdate.bind(this);
    this.handleTabCloseButtonClick = this.handleTabCloseButtonClick.bind(this);
    this.handleCloseTabCommandExecute = this.handleCloseTabCommandExecute.bind(this);

    this.state = {
      isAdmin: this.application.getUserPermissions().some(permission => permission === 'admin'),
    };
  }

  componentWillMount(): void {
    this.commandManager.registerCommandProvider(this);
    this.tabController.on('change', this.forceUpdate);
  }

  componentWillUnmount(): void {
    this.tabController.off('change', this.forceUpdate);
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands(): ICommand[] {
    const selectedTab = this.tabController.getSelectedTab();

    return [
      new CloseTabCommand(selectedTab, _.partial(this.handleCloseTabCommandExecute, selectedTab)),
    ];
  }

  private handleTabCloseButtonClick(tab: ITab, event: React.MouseEvent<HTMLSpanElement>): void {
    event.preventDefault();

    this.tabController.closeTab(tab);
  }

  private handleCloseTabCommandExecute(tab: ITab): void {
    this.tabController.closeTab(tab);
  }

  render(): JSX.Element {
    let links: JSX.Element[] = [
      <NavLink to="/" exact className="tab" activeClassName="active" key="issues">Issues</NavLink>,
      <NavLink to="/milestones" className="tab" activeClassName="active" key="milestones">Milestones</NavLink>,
    ];

    links = [
      ...links,
      ...this.tabController.getTabs().map(tab => {
        return (
          <NavLink to={tab.url} className="tab closable" activeClassName="active" key={`tab-${tab.key}`}>
            { tab.title } <span className="close-button" onClick={_.partial(this.handleTabCloseButtonClick, tab)}><Icon name="remove" /></span>
          </NavLink>
        );
      }),
    ];

    if (this.state.isAdmin) {
      links = [
        ...links,
        <NavLink to="/user-roles" className="tab right" activeClassName="active" key="user-roles">User Roles</NavLink>,
        <NavLink to="/projects" className="tab right" activeClassName="active" key="projects">Projects</NavLink>,
        <NavLink to="/users" className="tab right" activeClassName="active" key="users">Users</NavLink>,
      ];
    }

    return (
      <div className="navigation-component">
        { links }
      </div>
    );
  }
}
