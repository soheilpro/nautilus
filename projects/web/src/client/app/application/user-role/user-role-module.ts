import * as NQL from '../../nql';
import { IClient, IUserRole, IUserRoleChange } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { IUserRoleModule } from './iuser-role-module';
import { UserRoleExpressionNormalizer } from './user-role-expression-normalizer';
import { UserRole } from './user-role';

export class UserRoleModule extends BaseModule implements IUserRoleModule {
  private userRoles: IUserRole[];
  private userRolesMap: { [id: string]: IUserRole };

  constructor(private application: IApplication, private client: IClient) {
    super();
  }

  async load(): Promise<void> {
    const result = await this.client.userRoles.get(null);

    this.userRoles = [];
    this.userRolesMap = {};

    for (const entity of result.entities) {
      const userRole = new UserRole(entity, this.application);
      this.userRoles.push(userRole);
      this.userRolesMap[userRole.id] = userRole;
    }
  }

  getAll(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): IUserRole[] {
    let userRoles = [...this.userRoles];

    const expressionNormalizer = new UserRoleExpressionNormalizer();

    if (filterExpression)
      userRoles = this.filter(userRoles, filterExpression, expressionNormalizer);

    if (sortExpressions)
      userRoles = this.sort(userRoles, sortExpressions, expressionNormalizer);

    return userRoles;
  }

  get(userRole: IUserRole): IUserRole {
    if (!userRole)
      return null;

    return this.userRolesMap[userRole.id];
  }

  async add(userRole: IUserRole): Promise<IUserRole> {
    const newUserRole: IUserRole = {
      user: userRole.user,
      role: userRole.role,
      project: userRole.project,
    };

    const addedUserRole = new UserRole(await this.client.userRoles.insert(newUserRole), this.application);

    this.userRoles.push(addedUserRole);
    this.userRolesMap[addedUserRole.id] = addedUserRole;

    this.emit('userRole.add', { userRole: addedUserRole });

    return addedUserRole;
  }

  async update(userRole: IUserRole, userRoleChange: IUserRoleChange): Promise<IUserRole> {
    const change: IUserRoleChange = {
      user: userRoleChange.user,
      role: userRoleChange.role,
      project: userRoleChange.project,
    };

    const updatedUserRole = new UserRole(await this.client.userRoles.update(userRole.id, change), this.application);

    this.userRoles[this.userRoles.indexOf(userRole)] = updatedUserRole;
    this.userRolesMap[updatedUserRole.id] = updatedUserRole;

    this.emit('userRole.update', { userRole: updatedUserRole });

    return updatedUserRole;
  }

  async delete(userRole: IUserRole): Promise<void> {
    await this.client.userRoles.delete(userRole.id);

    this.userRoles.splice(this.userRoles.indexOf(userRole), 1);
    delete this.userRolesMap[userRole.id];

    this.emit('userRole.delete', { userRole: userRole });
  }
}
