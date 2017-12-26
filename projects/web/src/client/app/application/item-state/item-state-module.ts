import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { IApplication } from '../iapplication';
import ArrayHelper from '../../utilities/array-helper';
import { BaseModule } from '../base-module';
import { IItemState } from '../../sdk';
import { IItemStateModule } from './iitem-state-module';
import { ItemKind } from '../item';

export class ItemStateModule extends BaseModule implements IItemStateModule {
  private itemStates: IItemState[];
  private itemStatesMap: { [id: string]: IItemState };

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load(): Promise<void> {
    const result = await this.client.itemStates.get(null);

    this.itemStates = _.sortBy(result.entities, itemState => itemState.order);
    this.itemStatesMap = ArrayHelper.toMap(this.itemStates, itemState => itemState.id);
  }

  getAll(itemKind: ItemKind): IItemState[] {
    return this.itemStates.filter(itemState => itemState.itemKind === itemKind);
  }

  get(itemState: IItemState): IItemState {
    if (!itemState)
      return null;

    return this.itemStatesMap[itemState.id];
  }
}
