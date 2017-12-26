import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { IContextManager } from '../../../framework/context';
import { BaseCommand } from '../../../framework/commands';
import { IItemControllerManager } from '../../../framework/items';

export class DeleteItemCommand extends BaseCommand {
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private itemControllerManager = ServiceManager.Instance.getService<IItemControllerManager>('IItemControllerManager');

  constructor() {
    super();
  }

  get id(): string {
    return 'delete-item';
  }

  get title(): string {
    return 'Delete';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.D }];
  }

  get isEnabled(): boolean {
    const context = this.contextManager.getContext();
    const activeItemType = context['core.activeItemType'];
    const itemController = this.itemControllerManager.getItemController(activeItemType);

    return !!itemController;
  }

  execute(): void {
    const context = this.contextManager.getContext();
    const activeItemType = context['core.activeItemType'];
    const itemController = this.itemControllerManager.getItemController(activeItemType);
    const item = context['core.activeItem'];

    itemController.deleteItem(item);
  }
}
