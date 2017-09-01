import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { IApplication } from '../iapplication';
import ArrayHelper from '../../utilities/array-helper';
import { BaseModule } from '../base-module';
import { IItemType } from '../../sdk';
import { IItemTypeModule } from './iitem-type-module';
import { ItemKind } from '../item';

export class ItemTypeModule extends BaseModule implements IItemTypeModule {
  private itemTypes: IItemType[];
  private itemTypesMap: { [id: string]: IItemType };

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    const result = await this.client.itemTypes.get(null);

    this.itemTypes = _.sortBy(result.entities, itemType => itemType.order);
    this.itemTypesMap = ArrayHelper.toMap(this.itemTypes, itemType => itemType.id);
  }

  getAll(itemKind: ItemKind) {
    return this.itemTypes.filter(itemType => itemType.itemKind === itemKind);
  }

  get(itemType: IItemType) {
    if (!itemType)
      return null;

    return this.itemTypesMap[itemType.id];
  }
}
