import { IItemControllerManager } from './iitem-controller-manager';
import { IItemController } from './iitem-controller';

export class ItemControllerManager implements IItemControllerManager {
  private itemControllers: IObject<IItemController> = {};

  registerItemController(itemType: string, itemController: IItemController): void {
    this.itemControllers[itemType] = itemController;
  }

  unregisterItemController(itemType: string, itemController: IItemController): void {
    if (this.itemControllers[itemType] === itemController)
      delete this.itemControllers[itemType];
  }

  getItemController(itemType: string): IItemController {
    return this.itemControllers[itemType];
  }
}
