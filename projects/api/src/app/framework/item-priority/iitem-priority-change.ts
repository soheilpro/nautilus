import { IChange } from '../ichange';

export interface IItemPriorityChange extends IChange {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}
