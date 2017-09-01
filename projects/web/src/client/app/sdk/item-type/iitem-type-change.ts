import { IChange } from '../ichange';

export interface IItemTypeChange extends IChange {
  title?: string;
  key?: string;
  order?: number;
}
