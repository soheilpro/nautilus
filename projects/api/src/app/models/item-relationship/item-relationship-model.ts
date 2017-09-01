import { IItemRelationship } from '../../framework/item-relationship';
import { EntityModelBase } from '../entity-model-base';
import { IEntityModel } from '../ientity-model';

export class ItemRelationshipModel extends EntityModelBase {
  item1?: IEntityModel;
  item2?: IEntityModel;
  type?: string;

  constructor(entity: IItemRelationship) {
    super(entity);

    this.item1 = this.renderEntity(entity.item1);
    this.item2 = this.renderEntity(entity.item2);
    this.type = entity.type;
  }
}
