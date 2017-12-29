import * as React from 'react';
import { IIssue } from '../../application';
import { ICommandProvider, ICommand, ICommandManager } from '../../framework/commands';
import { ISearchController } from '../../modules/search';
import { ServiceManager } from '../../services';
import { IWindow, IWindowController } from '../../framework/windows';
import SearchWindow from '../search-window';

interface ISearchControllerProps {
}

interface ISearchControllerState {
}

export default class SearchController extends React.PureComponent<ISearchControllerProps, ISearchControllerState> implements ISearchController, ICommandProvider {
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');
  private searchWindow: IWindow;

  constructor() {
    super();

    this.handleSearchWindowIssueSelect = this.handleSearchWindowIssueSelect.bind(this);

    this.state = {};
  }

  componentWillMount(): void {
    ServiceManager.Instance.registerService('ISearchController', this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount(): void {
    this.commandManager.unregisterCommandProvider(this);
    ServiceManager.Instance.unregisterService('ISearchController', this);
  }

  showSearchWindow(): void {
    this.searchWindow = {
      content: <SearchWindow onIssueSelect={this.handleSearchWindowIssueSelect} />,
      top: 20,
      width: 600,
    };

    this.windowController.showWindow(this.searchWindow);
  }

  getCommands(): ICommand[] {
    return [];
  }

  private handleSearchWindowIssueSelect(issue: IIssue): void {
    this.windowController.closeWindow(this.searchWindow);
  }

  render(): JSX.Element {
    return (
      <div className="search-controller-component">
      </div>
    );
  }
}
