import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import { History } from 'history'
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import CommandController from '../command-controller';
import ActionController from '../action-controller';
import DialogController from '../dialog-controller';
import IssueController from '../issue-controller';
import MilestoneController from '../milestone-controller';
import NotificationController from '../notification-controller';
import SearchController from '../search-controller';
import WindowController from '../window-controller';
import IssuesPage from '../issues-page';
import MilestonesPage from '../milestones-page';
import RefreshCommand from './refresh-command';
import GoToIssuesCommand from './go-to-issues-command';
import GoToMilestonesCommand from './go-to-milestones-command';

interface IMainProps {
}

interface IMainState {
}

export default class Main extends React.PureComponent<IMainProps, IMainState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private browserRouterComponent: BrowserRouter;

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    const history: History = (this.browserRouterComponent as any).history;

    return [
      new RefreshCommand(),
      new GoToIssuesCommand(history),
      new GoToMilestonesCommand(history),
    ];
  }

  render() {
    return (
      <div className="main-component rtl">
        <WindowController />
        <DialogController />
        <NotificationController />
        <CommandController />
        <ActionController />
        <SearchController />
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
