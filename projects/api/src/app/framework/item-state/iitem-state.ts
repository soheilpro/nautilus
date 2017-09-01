import { IEntity } from '../ientity';

export interface IItemState extends IEntity {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}
