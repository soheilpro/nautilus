import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { History } from 'history';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { ServiceManager } from '../../services';
import CommandController from '../../framework/components/command-controller';
import DialogController from '../../framework/components/dialog-controller';
import ItemController from '../active-item-controller';
import IssueController from '../issue-controller';
import MilestoneController from '../milestone-controller';
import NotificationController from '../../framework/components/notification-controller';
import SearchController from '../search-controller';
import WindowController from '../../framework/components/window-controller';
import IssuesPage from '../issues-page';
import MilestonesPage from '../milestones-page';
import { RefreshCommand, GoToIssuesCommand, GoToMilestonesCommand } from './commands';

interface IMainProps {
}

interface IMainState {
}

export default class Main extends React.PureComponent<IMainProps, IMainState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private browserRouterComponent: BrowserRouter;

  componentWillMount(): void {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount(): void {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands(): ICommand[] {
    const history: History = (this.browserRouterComponent as any).history;

    return [
      new RefreshCommand(),
      new GoToIssuesCommand(history),
      new GoToMilestonesCommand(history),
    ];
  }

  render(): JSX.Element {
    return (
      <div className="main-component rtl">
        <WindowController />
        <DialogController />
        <NotificationController />
        <CommandController />
        <SearchController />
        <ItemController />
        <IssueController />
        <MilestoneController />
        <BrowserRouter ref={e => this.browserRouterComponent = e}>
          <div>
            <Route path="/" exact component={IssuesPage as any} />
            <Route path="/milestones" component={MilestonesPage as any} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
};
