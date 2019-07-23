import { IItemPriority } from './iitem-priority';
import { Entity } from '../entity';

export class ItemPriority extends Entity implements IItemPriority {
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
