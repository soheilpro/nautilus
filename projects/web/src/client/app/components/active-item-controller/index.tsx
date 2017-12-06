import * as React from 'react';
import { ServiceManager } from '../../services';
import { CopyItemIdCommand, EditItemCommand, DeleteItemCommand } from './commands';
import { ICommandProvider, ICommandManager } from '../../framework/commands';

interface IItemControllerProps {
}

interface IItemControllerState {
}

export default class ItemController extends React.PureComponent<IItemControllerProps, IItemControllerState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');

  constructor() {
    super();

    this.state = {};
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new CopyItemIdCommand(),
      new EditItemCommand(),
      new DeleteItemCommand(),
    ];
  }

  render() {
    return (
      <div className="item-controller-component">
      </div>
    );
  }
};
