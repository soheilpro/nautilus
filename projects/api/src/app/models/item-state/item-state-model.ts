import { IItemState } from '../../framework/item-state';
import { EntityModelBase } from '../entity-model-base';

export class ItemStateModel extends EntityModelBase {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;

  constructor(entity: IItemState) {
    super(entity);

    this.itemKind = entity.itemKind;
    this.title = entity.title;
    this.key = entity.key;
    this.order = entity.order;
  }
}
