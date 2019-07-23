import { IModule } from '../imodule';
import { IItemPriority } from '../../sdk';
import { ItemKind } from '../item';

export interface IItemPriorityModule extends IModule {
  getAll(itemKind: ItemKind): IItemPriority[];
  get(itemPriority: IItemPriority): IItemPriority;
}
