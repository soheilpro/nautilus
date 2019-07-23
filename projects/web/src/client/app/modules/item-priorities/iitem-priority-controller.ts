import { IItemPriority, ItemKind } from '../../application';

export interface IItemPriorityController {
  selectItemPriority(itemKind: ItemKind): Promise<IItemPriority>;
}
