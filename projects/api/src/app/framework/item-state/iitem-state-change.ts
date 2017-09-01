import { IChange } from '../ichange';

export interface IItemStateChange extends IChange {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}
