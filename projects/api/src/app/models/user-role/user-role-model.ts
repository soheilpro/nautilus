import { IUserRole } from '../../framework/user-role';
import { EntityModelBase } from '../entity-model-base';
import { IEntityModel } from '../ientity-model';

export class UserRoleModel extends EntityModelBase {
  user?: IEntityModel;
  role: string;
  project?: IEntityModel;

  constructor(entity: IUserRole) {
    super(entity);

    this.user = this.renderEntity(entity.user);
    this.role = entity.role;
    this.project = this.renderEntity(entity.project);
  }
}
