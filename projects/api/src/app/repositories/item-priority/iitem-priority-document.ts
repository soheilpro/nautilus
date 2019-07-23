import { IManagedDocument } from '../../db';

export interface IItemPriorityDocument extends IManagedDocument {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}
