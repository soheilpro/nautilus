import * as errors from 'restify-errors';
import { RouterBase } from '../router-base';
import { IUser, IUserManager, IUserChange, UserState } from '../../framework/user';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { UserModel } from '../../models';
import { IRequest, IResponse, IParams, Params } from '../../web';
import { IRoute } from '../iroute';

export class UserRouter extends RouterBase<IUser, IUserChange> {
  constructor(private userManager: IUserManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(userManager, userLogManager, dateTimeService);

    this.getPermissions = this.getPermissions.bind(this);
  }

  readonly name = 'users';

  getRoutes(): IRoute[] {
    return [
      this.protectedRoute('get',   '/users',                 this.getEntities),
      this.protectedRoute('get',   '/users/:id',             this.getEntity),
      this.protectedRoute('post',  '/users',                 this.postEntity),
      this.protectedRoute('patch', '/users/:id',             this.patchEntity),
      this.protectedRoute('del',   '/users/:id',             this.deleteEntity),
      this.protectedRoute('get',   '/users/:id/permissions', this.getPermissions),
    ];
  }

  checkEntityAccessSync(entity: IUser, access: string, request: IRequest): boolean {
    switch (access) {
      case 'create':
        return false;

      case 'read':
        return (entity.id === request.user.id);

      case 'update':
      case 'delete':
        return false;

      default:
        throw new Error('Not supported.');
    }
  }

  async getPermissions(request: IRequest, response: IResponse): Promise<void> {
    const params = new Params(request.params);
    const user = await params.readEntity('id', this.userManager);

    if (!user)
      return response.send(new errors.NotFoundError());

    if (user.id !== request.user.id)
      return response.send(new errors.ForbiddenError());

    const data = request.permissions;

    response.send({
      data: data,
    });
  }

  async entityFromParams(params: IParams, request: IRequest): Promise<IUser> {
    return {
      ...await super.entityFromParams(params, request),
      username: params.readString('username'),
      password: params.readString('password'),
      name: params.readString('name'),
      email: params.readString('email'),
      state: (params.readString('state') as UserState) || 'enabled',
    };
  }

  async changeFromParams(params: IParams, request: IRequest): Promise<IUserChange> {
    return {
      ...await super.changeFromParams(params, request),
      username: params.readString('username'),
      password: params.readString('password'),
      name: params.readString('name'),
      email: params.readString('email'),
      state: params.readString('state'),
    };
  }

  entityToModel(entity: IUser): UserModel {
    if (!entity)
      return undefined;

    return new UserModel(entity);
  }
}
