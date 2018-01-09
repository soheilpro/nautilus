import * as React from 'react';
import { ServiceManager } from '../../services';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { IContextManager } from '../../framework/context';
import { IItemControllerManager } from '../../framework/items';
import { IClipboard } from '../../framework/clipboard';
import { INotificationController } from '../../framework/notifications';
import { CopyItemIdCommand, EditItemCommand, DeleteItemCommand } from './commands';

interface IActiveItemControllerProps {
}

interface IActiveItemControllerState {
}

export class ActiveItemController extends React.PureComponent<IActiveItemControllerProps, IActiveItemControllerState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private itemControllerManager = ServiceManager.Instance.getService<IItemControllerManager>('IItemControllerManager');
  private clipboard = ServiceManager.Instance.getService<IClipboard>('IClipboard');
  private notificationController = ServiceManager.Instance.getService<INotificationController>('INotificationController');

  constructor() {
    super();

    this.state = {};
  }

  componentWillMount(): void {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount(): void {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands(): ICommand[] {
    return [
      new CopyItemIdCommand(this, this.contextManager, this.itemControllerManager),
      new EditItemCommand(this, this.contextManager, this.itemControllerManager),
      new DeleteItemCommand(this, this.contextManager, this.itemControllerManager),
    ];
  }

  editItem(item: any, itemType: string): void {
    const itemController = this.itemControllerManager.getItemController(itemType);

    itemController.editItem(item);
  }

  deleteItem(item: any, itemType: string): void {
    const itemController = this.itemControllerManager.getItemController(itemType);

    itemController.deleteItem(item);
  }

  copyItemId(item: any, itemType: string): void {
    const itemController = this.itemControllerManager.getItemController(itemType);
    const itemId = itemController.getItemId(item);

    this.clipboard.copyText(itemId);

    this.notificationController.showNotification({
      title: 'Id copied to clipboard.',
      type: 'success',
    },
    {
      hideAfter: 2000,
    });
  }

  render(): JSX.Element {
    return (
      <div className="active-item-controller-component">
      </div>
    );
  }
}
