import { KeyCode } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { IContextManager } from '../../../framework/context';
import { BaseCommand } from '../../../framework/commands';
import { IItemControllerManager } from '../../../framework/items';

export class EditItemCommand extends BaseCommand {
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private itemControllerManager = ServiceManager.Instance.getService<IItemControllerManager>('IItemControllerManager');

  constructor() {
    super();
  }

  get id() {
    return 'edit-item';
  }

  get title() {
    return 'Edit';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.E }];
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

    itemController.editItem(item);
  }
}
