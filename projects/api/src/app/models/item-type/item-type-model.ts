import { IItemType } from '../../framework/item-type';
import { EntityModelBase } from '../entity-model-base';

export class ItemTypeModel extends EntityModelBase {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;

  constructor(entity: IItemType) {
    super(entity);

    this.itemKind = entity.itemKind;
    this.title = entity.title;
    this.key = entity.key;
    this.order = entity.order;
  }
}
