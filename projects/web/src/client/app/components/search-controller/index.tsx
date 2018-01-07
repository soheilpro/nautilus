import * as React from 'react';
import { IIssue } from '../../application';
import { ICommandProvider, ICommand, ICommandManager } from '../../framework/commands';
import { ISearchController } from '../../modules/search';
import { ServiceManager } from '../../services';
import { IWindowController } from '../../framework/windows';
import { SearchWindow } from '../search-window';

interface ISearchControllerProps {
}

interface ISearchControllerState {
}

export class SearchController extends React.PureComponent<ISearchControllerProps, ISearchControllerState> implements ISearchController, ICommandProvider {
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');

  componentWillMount(): void {
    ServiceManager.Instance.registerService('ISearchController', this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount(): void {
    this.commandManager.unregisterCommandProvider(this);
    ServiceManager.Instance.unregisterService('ISearchController', this);
  }

  showSearchWindow(): void {
    const handleIssueSelect = (issue: IIssue) => {
      this.windowController.closeWindow(handle);
    };

    const window = <SearchWindow onIssueSelect={handleIssueSelect} />;
    const options = {
      top: 20,
      width: 600,
    };

    const handle = this.windowController.showWindow(window, options);
  }

  getCommands(): ICommand[] {
    return [];
  }

  render(): JSX.Element {
    return (
      <div className="search-controller-component">
      </div>
    );
  }
}
