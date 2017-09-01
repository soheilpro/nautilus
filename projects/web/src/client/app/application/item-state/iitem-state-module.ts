import { IModule } from '../imodule';
import { IItemState } from '../../sdk';
import { ItemKind } from '../item';

export interface IItemStateModule extends IModule {
  getAll(itemKind: ItemKind): IItemState[];
  get(itemState: IItemState): IItemState;
}
