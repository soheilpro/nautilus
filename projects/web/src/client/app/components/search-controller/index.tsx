import * as React from 'react';
import { IIssue } from '../../application';
import { ICommandProvider, ICommand } from '../../commands';
import { ISearchController } from '../../search';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import SearchWindow from '../search-window';

interface ISearchControllerProps {
}

interface ISearchControllerState {
}

export default class SearchController extends React.PureComponent<ISearchControllerProps, ISearchControllerState> implements ISearchController, ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowController = ServiceManager.Instance.getWindowController();
  private searchWindow: IWindow;

  constructor() {
    super();

    this.handleSearchWindowIssueSelect = this.handleSearchWindowIssueSelect.bind(this);

    this.state = {};
  }

  componentWillMount() {
    ServiceManager.Instance.setSearchController(this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
    ServiceManager.Instance.setSearchController(undefined);
  }

  showSearchWindow() {
    this.searchWindow = {
      content: <SearchWindow onIssueSelect={this.handleSearchWindowIssueSelect} />,
      top: 20,
      width: 600,
    };

    this.windowController.showWindow(this.searchWindow);
  }

  getCommands() {
    return [
      // new SearchCommand(),
    ] as ICommand[];
  }

  private handleSearchWindowIssueSelect(issue: IIssue) {
    this.windowController.closeWindow(this.searchWindow);
  }

  render() {
    return (
      <div className="search-controller-component">
      </div>
    );
  }
};
