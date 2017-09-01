import { IManagedDocument } from '../../db';

export interface IItemTypeDocument extends IManagedDocument {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}
