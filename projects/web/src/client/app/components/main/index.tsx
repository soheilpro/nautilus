import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { History } from 'history';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { ServiceManager } from '../../services';
import { CommandController } from '../../framework/components/command-controller';
import { DialogController } from '../../framework/components/dialog-controller';
import { ActiveItemController } from '../active-item-controller';
import { UserController } from '../user-controller';
import { ProjectController } from '../project-controller';
import { UserRoleController } from '../user-role-controller';
import { ItemStateController } from '../item-state-controller';
import { IssueController } from '../issue-controller';
import { MilestoneController } from '../milestone-controller';
import { NotificationController } from '../../framework/components/notification-controller';
import { SearchController } from '../search-controller';
import { WindowController } from '../../framework/components/window-controller';
import { IApplication } from '../../application';
import { IssuesPage } from '../issues-page';
import { MilestonesPage } from '../milestones-page';
import { UsersPage } from '../users-page';
import { ProjectsPage } from '../projects-page';
import { UserRolesPage } from '../user-roles-page';
import { RefreshCommand, GoToIssuesCommand, GoToMilestonesCommand, GoToUsersCommand, GoToProjectsCommand } from './commands';
import { GoToUserRolesCommand } from './commands/go-to-user-roles-command';
import { INotificationController } from '../../framework/notifications';

interface IMainProps {
}

interface IMainState {
  isAdmin: boolean;
}

export class Main extends React.PureComponent<IMainProps, IMainState> implements ICommandProvider {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private browserRouterRef: BrowserRouter;

  private get notificationController(): INotificationController {
    return ServiceManager.Instance.getService<INotificationController>('INotificationController');
  }

  constructor() {
    super();

    this.state = {
      isAdmin: this.application.getUserPermissions().some(permission => permission === 'admin'),
    };
  }

  componentWillMount(): void {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount(): void {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands(): ICommand[] {
    const history: History = (this.browserRouterRef as any).history;

    let commands: ICommand[] = [
      new RefreshCommand(this.application, this.notificationController),
      new GoToIssuesCommand(history),
      new GoToMilestonesCommand(history),
    ];

    if (this.state.isAdmin) {
      commands = [
        ...commands,
        new GoToUsersCommand(history),
        new GoToProjectsCommand(history),
        new GoToUserRolesCommand(history),
      ];
    }

    return commands;
  }

  render(): JSX.Element {
    let routes: JSX.Element[] = [
      <Route path="/" exact component={IssuesPage as any} key="issues" />,
      <Route path="/milestones" component={MilestonesPage as any} key="milestones" />,
    ];

    if (this.state.isAdmin) {
      routes = [
        ...routes,
        <Route path="/users" component={UsersPage as any} key="users" />,
        <Route path="/projects" component={ProjectsPage as any} key="projects" />,
        <Route path="/user-roles" component={UserRolesPage as any} key="user-roles" />,
      ];
    }

    return (
      <div className="main-component rtl">
        <WindowController />
        <DialogController />
        <NotificationController />
        <CommandController />
        <SearchController />
        <ActiveItemController />
        <IssueController />
        <MilestoneController />
        <UserController />
        <ProjectController />
        <UserRoleController />
        <ItemStateController />
        <BrowserRouter ref={e => this.browserRouterRef = e}>
          <div>{ routes }</div>
        </BrowserRouter>
      </div>
    );
  }
}
