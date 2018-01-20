import { IItemState, ItemKind } from '../../application';

export interface IItemStateController {
  selectItemState(itemKind: ItemKind): Promise<IItemState>;
}
