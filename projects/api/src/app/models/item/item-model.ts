import { IItem } from '../../framework/item';
import { EntityModelBase } from '../entity-model-base';
import { IEntityModel } from '../ientity-model';

export class ItemModel extends EntityModelBase {
  sid?: string;
  kind?: string;
  type?: IEntityModel;
  title?: string;
  description?: string;
  state?: IEntityModel;
  tags?: string[];
  project?: IEntityModel;
  assignedTo?: IEntityModel;
  createdBy?: IEntityModel;
  modifiedBy?: IEntityModel;

  constructor(entity: IItem) {
    super(entity);

    this.sid = entity.sid;
    this.kind = entity.kind;
    this.type = this.renderEntity(entity.type);
    this.title = entity.title || undefined;
    this.description = entity.description || undefined;
    this.state = this.renderEntity(entity.state);
    this.tags = entity.tags;
    this.project = this.renderEntity(entity.project);
    this.assignedTo = this.renderEntity(entity.assignedTo);
    this.createdBy = this.renderEntity(entity.createdBy);
    this.modifiedBy = this.renderEntity(entity.modifiedBy);
  }
}
