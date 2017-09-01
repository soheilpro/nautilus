import * as _ from 'underscore';
import { IUserRole, IUserRoleManager, UserRoleFilter } from '../framework/user-role';
import { IUser } from '../framework/user';
import { IPermissionProvider } from './ipermission-provider';

export class PermissionProvider implements IPermissionProvider {
  constructor(private userRoleManager: IUserRoleManager) {
  }

  async getPermissions(user: IUser): Promise<string[]> {
    let permissions: string[] = [];

    const userRoleFilter = new UserRoleFilter(user);
    const userRoles = await this.userRoleManager.getAll(userRoleFilter);

    for (const userRole of userRoles)
      permissions = [...permissions, ...Array.from(this.getPermissionsForRole(userRole))];

    return _.uniq(_.sortBy(permissions), true);
  }

  private * getPermissionsForRole(userRole: IUserRole): IterableIterator<string> {
    switch (userRole.name) {
      case 'system.admin':
        yield 'item-relationships:create';
        yield 'item-relationships.*:read';
        yield 'item-relationships.*:update';
        yield 'item-relationships.*:delete';
        yield 'item-states:create';
        yield 'item-states.*:read';
        yield 'item-states.*:update';
        yield 'item-states.*:delete';
        yield 'item-types:create';
        yield 'item-types.*:read';
        yield 'item-types.*:update';
        yield 'item-types.*:delete';
        yield 'items:create';
        yield 'items.*:read';
        yield 'items.*:update';
        yield 'items.*:delete';
        yield 'projects:create';
        yield 'projects.*:read';
        yield 'projects.*:update';
        yield 'projects.*:delete';
        yield 'projects.*.items:read';
        yield 'projects.*.items:modify';
        yield 'sessions:create';
        yield 'sessions.*:read';
        yield 'sessions.*:update';
        yield 'sessions.*:delete';
        yield 'user-roles:create';
        yield 'user-roles.*:read';
        yield 'user-roles.*:update';
        yield 'user-roles.*:delete';
        yield 'users:create';
        yield 'users.*:read';
        yield 'users.*:update';
        yield 'users.*:delete';
        break;

      case 'project.member':
        yield 'item-states.*:read';
        yield 'item-types.*:read';
        yield `projects.${userRole.project.id}:read`;
        yield `projects.${userRole.project.id}.items:read`;
        yield `projects.${userRole.project.id}.items:modify`;
        yield 'users.*:read';
        break;
    }
  }
}
