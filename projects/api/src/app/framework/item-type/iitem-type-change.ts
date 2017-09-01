import { IChange } from '../ichange';

export interface IItemTypeChange extends IChange {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}
