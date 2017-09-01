import { IManagedDocument } from '../../db';

export interface IItemStateDocument extends IManagedDocument {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}
