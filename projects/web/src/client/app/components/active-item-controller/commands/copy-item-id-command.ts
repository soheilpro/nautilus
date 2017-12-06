import { ServiceManager } from '../../../services';
import { INotificationController } from '../../../framework/notifications';
import { IClipboard } from '../../../framework/clipboard';
import { IContextManager } from '../../../framework/context';
import { BaseCommand } from '../../../framework/commands';
import { IItemControllerManager } from '../../../framework/items';

export class CopyItemIdCommand extends BaseCommand {
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private itemControllerManager = ServiceManager.Instance.getService<IItemControllerManager>('IItemControllerManager');
  private clipboard = ServiceManager.Instance.getService<IClipboard>('IClipboard');
  private notificationController = ServiceManager.Instance.getService<INotificationController>('INotificationController');

  constructor() {
    super();
  }

  get id() {
    return 'copy-item-id';
  }

  get title() {
    return 'Copy id to clipboard';
  }

  get isEnabled() {
    const context = this.contextManager.getContext();
    const activeItemType = context['core.activeItemType'];
    const itemController = this.itemControllerManager.getItemController(activeItemType);

    return !!itemController;
  }

  execute() {
    const context = this.contextManager.getContext();
    const activeItemType = context['core.activeItemType'];
    const itemController = this.itemControllerManager.getItemController(activeItemType);
    const item = context['core.activeItem'];
    const itemId = itemController.getItemId(item);

    this.clipboard.copyText(itemId);

    this.notificationController.showNotification({
      title: 'Id copied to clipboard.',
      type: 'success',
    },
    {
      hideAfter: 2000
    });
  }
}
