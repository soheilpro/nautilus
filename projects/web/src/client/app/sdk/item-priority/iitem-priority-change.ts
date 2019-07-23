import { IChange } from '../ichange';

export interface IItemPriorityChange extends IChange {
  title?: string;
  key?: string;
  order?: number;
}
