import { RouterBase } from '../router-base';
import { IUserRole, IUserRoleManager, IUserRoleChange } from '../../framework/user-role';
import { IProjectManager } from '../../framework/project';
import { IUserManager } from '../../framework/user';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { UserRoleModel } from '../../models';
import { IRequest, IParams } from '../../web';
import { IRoute } from '../iroute';

export class UserRoleRouter extends RouterBase<IUserRole, IUserRoleChange> {
  constructor(userRoleManager: IUserRoleManager, private userManager: IUserManager, private projectManager: IProjectManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(userRoleManager, userLogManager, dateTimeService);
  }

  readonly name = 'user-roles';

  getRoutes(): IRoute[] {
    return [
      this.protectedRoute('get',   '/user-roles',     this.getEntities),
      this.protectedRoute('get',   '/user-roles/:id', this.getEntity),
      this.protectedRoute('post',  '/user-roles',     this.postEntity),
      this.protectedRoute('patch', '/user-roles/:id', this.patchEntity),
      this.protectedRoute('del',   '/user-roles/:id', this.deleteEntity),
    ];
  }

  checkEntityAccessSync(entity: IUserRole, access: string, request: IRequest): boolean {
    switch (access) {
      case 'create':
        return false;

      case 'read':
        return (entity.user.id === request.user.id);

      case 'update':
      case 'delete':
        return false;

      default:
        throw new Error('Not supported.');
    }
  }

  async entityFromParams(params: IParams, request: IRequest): Promise<IUserRole> {
    return {
      ...await super.entityFromParams(params, request),
      user: await params.readEntity('user_id', this.userManager),
      project: await params.readEntity('project_id', this.projectManager),
      name: params.readString('name'),
    };
  }

  async changeFromParams(params: IParams, request: IRequest): Promise<IUserRoleChange> {
    return {
      ...await super.changeFromParams(params, request),
      user: await params.readEntity('user_id', this.userManager),
      project: await params.readEntity('project_id', this.projectManager),
      name: params.readString('name'),
    };
  }

  entityToModel(entity: IUserRole): UserRoleModel {
    if (!entity)
      return undefined;

    return new UserRoleModel(entity);
  }
}
