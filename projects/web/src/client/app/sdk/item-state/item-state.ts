import { IItemState } from './iitem-state';
import { Entity } from '../entity';

export class ItemState extends Entity implements IItemState {
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
