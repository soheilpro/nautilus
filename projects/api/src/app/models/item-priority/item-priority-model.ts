import { IItemPriority } from '../../framework/item-priority';
import { EntityModelBase } from '../entity-model-base';

export class ItemPriorityModel extends EntityModelBase {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;

  constructor(entity: IItemPriority) {
    super(entity);

    this.itemKind = entity.itemKind;
    this.title = entity.title;
    this.key = entity.key;
    this.order = entity.order;
  }
}
