import { IEntity } from '../ientity';

export interface IItemRelationship extends IEntity {
  item1?: IEntity;
  item2?: IEntity;
  type?: string;
}
