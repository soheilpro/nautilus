import { ServiceBase } from '../service-base';
import { IUser } from './iuser';
import { IUserChange } from './iuser-change';
import { IUserFilter } from './iuser-filter';
import { IUserGetResult } from './iuser-get-result';
import { IUserPermission } from './iuser-permission';
import { IUserService } from './iuser-service';
import { User } from './user';

export class UserService extends ServiceBase<IUser, IUserFilter, IUserChange, IUserGetResult> implements IUserService {
  basePath(): string {
    return '/users';
  }

  deserializeEntity(data: any): IUser {
    return new User(data);
  }

  serializeFilter(filter: IUserFilter): Object {
    return {
      username: filter.username,
    };
  }

  serializeEntity(entity: IUser): Object {
    return {
      username: entity.username,
      password: entity.password,
      name: entity.name,
      email: entity.email,
    };
  }

  serializeChange(change: IUserChange): Object {
    return {
      username: change.username,
      password: change.password,
      name: change.name,
      email: change.email,
    };
  }

  getUserPermissions(user: IUser): Promise<IUserPermission[]> {
    const options = {
      method: 'GET',
      path: `${this.basePath()}/${user.id}/permissions`,
    };

    return this.invoke(options);
  }
}
