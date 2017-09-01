import { IUserRole } from '../../framework/user-role';
import { EntityModelBase } from '../entity-model-base';
import { IEntityModel } from '../ientity-model';

export class UserRoleModel extends EntityModelBase {
  user?: IEntityModel;
  project?: IEntityModel;
  name: string;

  constructor(entity: IUserRole) {
    super(entity);

    this.user = this.renderEntity(entity.user);
    this.project = this.renderEntity(entity.project);
    this.name = entity.name;
  }
}
