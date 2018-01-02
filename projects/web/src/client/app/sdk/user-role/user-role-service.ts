import { ServiceBase } from '../service-base';
import { IUserRole } from './iuser-role';
import { IUserRoleChange } from './iuser-role-change';
import { IUserRoleFilter } from './iuser-role-filter';
import { IUserRoleGetResult } from './iuser-role-get-result';
import { IUserRoleService } from './iuser-role-service';
import { UserRole } from './user-role';

export class UserRoleService extends ServiceBase<IUserRole, IUserRoleFilter, IUserRoleChange, IUserRoleGetResult> implements IUserRoleService {
  basePath(): string {
    return '/user-roles';
  }

  deserializeEntity(data: any): IUserRole {
    return new UserRole(data);
  }

  serializeFilter(filter: IUserRoleFilter): Object {
    return undefined;
  }

  serializeEntity(entity: IUserRole): Object {
    return {
      user_id: this.toId(entity.user),
      role: entity.role,
      project_id: this.toId(entity.project),
    };
  }

  serializeChange(change: IUserRoleChange): Object {
    return {
      user_id: this.toId(change.user),
      role: change.role,
      project_id: this.toId(change.project),
    };
  }
}
