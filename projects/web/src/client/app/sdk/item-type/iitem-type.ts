import { IEntity } from '../ientity';

export interface IItemType extends IEntity {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}
