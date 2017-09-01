import { IModule } from '../imodule';
import { IItemType } from '../../sdk';
import { ItemKind } from '../item';

export interface IItemTypeModule extends IModule {
  getAll(itemKind: ItemKind): IItemType[];
  get(itemType: IItemType): IItemType;
}
