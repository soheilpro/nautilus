import { IItemRelationship } from './iitem-relationship';
import { IEntity } from '../ientity';
import { Entity } from '../entity';

export class ItemRelationship extends Entity implements IItemRelationship {
  item1?: IEntity;
  item2?: IEntity;
  type?: string;

  constructor(data: any) {
    super(data);

    this.item1 = new Entity(data.item1);
    this.item2 = new Entity(data.item2);
    this.type = data.type;
  }
}
