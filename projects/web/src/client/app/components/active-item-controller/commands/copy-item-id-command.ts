import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { IContextManager } from '../../../framework/context';
import { BaseCommand } from '../../../framework/commands';
import { IActiveItemController } from '../../../modules/active-item';
import { IItemControllerManager } from '../../../framework/items';

export class CopyItemIdCommand extends BaseCommand {
  constructor(private activeItemController: IActiveItemController, private contextManager: IContextManager, private itemControllerManager: IItemControllerManager) {
    super();
  }

  get id(): string {
    return 'copy-item-id';
  }

  get title(): string {
    return 'Copy id to clipboard';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.C },
      { keyCode: KeyCode.I },
    ];
  }

  get isEnabled(): boolean {
    const context = this.contextManager.getContext();
    const activeItemType = context['core.activeItemType'];
    const itemController = this.itemControllerManager.getItemController(activeItemType);

    return !!itemController;
  }

  execute(): void {
    const context = this.contextManager.getContext();
    const activeItem = context['core.activeItem'];
    const activeItemType = context['core.activeItemType'];

    this.activeItemController.copyItemId(activeItem, activeItemType);
  }
}
