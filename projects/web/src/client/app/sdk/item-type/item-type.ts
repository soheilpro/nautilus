import { IItemType } from './iitem-type';
import { Entity } from '../entity';

export class ItemType extends Entity implements IItemType {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;

  constructor(data: any) {
    super(data);

    this.itemKind = data.itemKind;
    this.title = data.title;
    this.key = data.key;
    this.order = data.order;
  }
}
