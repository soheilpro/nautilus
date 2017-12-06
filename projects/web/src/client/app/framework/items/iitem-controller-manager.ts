import { IItemController } from './iitem-controller';

export interface IItemControllerManager {
  registerItemController(itemType: string, itemController: IItemController): void;
  unregisterItemController(itemType: string, itemController: IItemController): void;
  getItemController(itemType: string): IItemController;
}
