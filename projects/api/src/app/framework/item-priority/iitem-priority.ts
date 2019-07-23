import { IEntity } from '../ientity';

export interface IItemPriority extends IEntity {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}
