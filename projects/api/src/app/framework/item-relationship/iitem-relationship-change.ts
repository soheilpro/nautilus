import { IChange } from '../ichange';
import { IEntity } from '../ientity';

export interface IItemRelationshipChange extends IChange {
  item1?: IEntity;
  item2?: IEntity;
  type?: string;
}
