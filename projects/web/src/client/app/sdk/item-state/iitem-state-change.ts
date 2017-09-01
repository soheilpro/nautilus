import { IChange } from '../ichange';

export interface IItemStateChange extends IChange {
  title?: string;
  key?: string;
  order?: number;
}
