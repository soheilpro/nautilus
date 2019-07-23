import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { IApplication } from '../iapplication';
import { ArrayHelper } from '../../utilities/array-helper';
import { BaseModule } from '../base-module';
import { IItemPriority } from '../../sdk';
import { IItemPriorityModule } from './iitem-priority-module';
import { ItemKind } from '../item';

export class ItemPriorityModule extends BaseModule implements IItemPriorityModule {
  private itemPriorities: IItemPriority[];
  private itemPrioritiesMap: { [id: string]: IItemPriority };

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load(): Promise<void> {
    const result = await this.client.itemPriorities.get(null);

    this.itemPriorities = _.sortBy(result.entities, itemPriority => itemPriority.order);
    this.itemPrioritiesMap = ArrayHelper.toMap(this.itemPriorities, itemPriority => itemPriority.id);
  }

  getAll(itemKind: ItemKind): IItemPriority[] {
    return this.itemPriorities.filter(itemPriority => itemPriority.itemKind === itemKind);
  }

  get(itemPriority: IItemPriority): IItemPriority {
    if (!itemPriority)
      return null;

    return this.itemPrioritiesMap[itemPriority.id];
  }
}
