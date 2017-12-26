import * as restify from 'restify';
import * as errors from 'restify-errors';
import { IEntity, IFilter, IChange, IManager, DuplicateEntityError } from '../framework';
import { IUserLog, IUserLogManager } from '../framework/user-log';
import { PermissionHelper } from '../security';
import { IDateTimeService } from '../services';
import { IRouter, IRequest, IResponse, IParams, Params, InvalidEntityParamError } from '../web';
import { IRoute } from './iroute';

export abstract class RouterBase<TEntity extends IEntity, TChange extends IChange> implements IRouter {
  constructor(private manager: IManager<TEntity, TChange>, private userLogManager: IUserLogManager, private dateTimeService: IDateTimeService) {
    this.getEntities = this.getEntities.bind(this);
    this.getEntity = this.getEntity.bind(this);
    this.postEntity = this.postEntity.bind(this);
    this.patchEntity = this.patchEntity.bind(this);
    this.deleteEntity = this.deleteEntity.bind(this);
  }

  register(server: restify.Server): void {
    for (const route of this.getRoutes())
      (server as any)[route.method](route.url, this.authorize(route.isProtected, route.permissions), route.handler);
  }

  abstract readonly name: string;

  abstract getRoutes(): IRoute[];

  protected route(method: string, url: string, handler: restify.RequestHandler): IRoute {
    return {
      method: method,
      url: url,
      handler: handler,
    };
  }

  protected protectedRoute(method: string, url: string, handler: restify.RequestHandler, permissions?: string[]): IRoute {
    return {
      method: method,
      url: url,
      handler: handler,
      isProtected: true,
      permissions: permissions,
    };
  }

  private authorize(isProtected: boolean, permissions?: string[]): restify.RequestHandler {
    return (request: IRequest, response: IResponse, next: restify.Next): void => {
      if (isProtected) {
        if (!request.user)
          return response.send(new errors.UnauthorizedError());

        if (permissions && permissions.length !== 0)
          if (!permissions.every(permission => this.hasPermission(permission, request)))
            return response.send(new errors.ForbiddenError());
      }

      next();
    };
  }

  protected async getEntities(request: IRequest, response: IResponse): Promise<void> {
    try {
      const queryParams = new Params(request.query);
      const filter = await this.filterFromParams(queryParams, request);
      const entities = await this.manager.getAll(filter);

      const accessibleEntities = [];

      for (const entity of entities)
        if (await this.canAccessEntity(entity, 'read', request))
          accessibleEntities.push(entity);

      const data = accessibleEntities.map(entity => this.entityToModel(entity));
      const supplements = await this.getSupplements(queryParams, accessibleEntities);

      response.send({
        data: data,
        supplements: supplements,
      });
    }
    catch (error) {
      if (error instanceof InvalidEntityParamError)
        return response.send(new errors.UnprocessableEntityError('Invalid entity id.'));

      throw error;
    }
  }

  protected async getEntity(request: IRequest, response: IResponse): Promise<void> {
    try {
      const routeParams = new Params(request.params);
      const entity = await routeParams.readEntity('id', this.manager, true);

      if (!entity)
        return response.send(new errors.NotFoundError());

      if (!(await this.canAccessEntity(entity, 'read', request)))
        return response.send(new errors.ForbiddenError());

      const data = this.entityToModel(entity);
      const queryParams = new Params(request.query);
      const supplements = await this.getSupplements(queryParams, [entity]);

      response.send({
        data: data,
        supplements: supplements,
      });
    }
    catch (error) {
      if (error instanceof InvalidEntityParamError)
        return response.send(new errors.UnprocessableEntityError('Invalid entity id.'));

      throw error;
    }
  }

  protected async postEntity(request: IRequest, response: IResponse): Promise<void> {
    try {
      const bodyParams = new Params(request.body);
      const entity = await this.entityFromParams(bodyParams, request);

      if (!(await this.canAccessEntity(entity, 'create', request)))
        return response.send(new errors.ForbiddenError());

      const validationError = this.manager.validateEntity(entity);

      if (validationError)
        return response.send(new errors.UnprocessableEntityError(validationError.message));

      const insertedEntity = await this.manager.insert(entity);

      let userLog: IUserLog = {
        dateTime: this.dateTimeService.nowUTC(),
        user: request.user,
        action: `${this.name}.create`,
        item: insertedEntity,
        params: {
          entity: insertedEntity,
        },
      };

      await this.userLogManager.insert(userLog);

      const data = this.entityToModel(insertedEntity);

      response.send(201, {
        data: data,
      });
    }
    catch (error) {
      if (error instanceof InvalidEntityParamError)
        return response.send(new errors.UnprocessableEntityError('Invalid entity id.'));

      if (error instanceof DuplicateEntityError)
        return response.send(new errors.UnprocessableEntityError('Duplicate entity.'));

      throw error;
    }
  }

  protected async patchEntity(request: IRequest, response: IResponse): Promise<void> {
    try {
      const routeParams = new Params(request.params);
      const entity = await routeParams.readEntity('id', this.manager, true);

      if (!entity)
        return response.send(new errors.NotFoundError());

      if (!(await this.canAccessEntity(entity, 'update', request)))
        return response.send(new errors.ForbiddenError());

      const bodyParams = new Params(request.body);
      const change = await this.changeFromParams(bodyParams, request);

      const validationError = this.manager.validateChange(change);

      if (validationError)
        return response.send(new errors.UnprocessableEntityError(validationError.message));

      if (!(await this.canChangeEntity(entity, change, request)))
        return response.send(new errors.ForbiddenError());

      const updatedEntity = await this.manager.update(entity.id, change);

      let userLog: IUserLog = {
        dateTime: this.dateTimeService.nowUTC(),
        user: request.user,
        action: `${this.name}.update`,
        item: updatedEntity,
        params: {
          change: change,
        },
      };

      await this.userLogManager.insert(userLog);

      const data = this.entityToModel(updatedEntity);

      response.send({
        data: data,
      });
    }
    catch (error) {
      if (error instanceof InvalidEntityParamError)
        return response.send(new errors.UnprocessableEntityError('Invalid entity id.'));

      if (error instanceof DuplicateEntityError)
        return response.send(new errors.UnprocessableEntityError('Duplicate entity.'));

      throw error;
    }
  }

  protected async deleteEntity(request: IRequest, response: IResponse): Promise<void> {
    const routeParams = new Params(request.params);
    const entity = await routeParams.readEntity('id', this.manager, true);

    if (!entity)
      return response.send(new errors.NotFoundError());

    if (!(await this.canAccessEntity(entity, 'delete', request)))
      return response.send(new errors.ForbiddenError());

    await this.manager.delete(entity.id);

    let userLog: IUserLog = {
      dateTime: this.dateTimeService.nowUTC(),
      user: request.user,
      action: `${this.name}.delete`,
      item: entity,
    };

    await this.userLogManager.insert(userLog);

    response.send(200);
  }

  protected filterFromParams(params: IParams, request: IRequest): Promise<IFilter> {
    return Promise.resolve(null);
  }

  protected entityFromParams(params: IParams, request: IRequest): Promise<TEntity> {
    return Promise.resolve({} as TEntity);
  }

  protected changeFromParams(params: IParams, request: IRequest): Promise<TChange> {
    return Promise.resolve({} as TChange);
  }

  async canAccessEntity(entity: TEntity, access: string, request: IRequest): Promise<boolean> {
    return await this.checkEntityAccess(entity, access, request) ||
                 this.checkEntityPermisisons(this.name, entity, access, request);
  }

  protected checkEntityAccess(entity: TEntity, access: string, request: IRequest): Promise<boolean> {
    return Promise.resolve(this.checkEntityAccessSync(entity, access, request));
  }

  protected checkEntityAccessSync(entity: TEntity, access: string, request: IRequest): boolean {
    return false;
  }

  protected checkEntityPermisisons(name: string, entity: IEntity, access: string, request: IRequest): boolean {
    switch (access) {
      case 'create':
        return this.hasPermission(`${name}:${access}`, request);

      case 'read':
      case 'update':
      case 'delete':
        return this.hasPermission(`${name}.${entity.id}:${access}`, request);

      default:
        throw new Error('Not supported.');
    }
  }

  async canChangeEntity(entity: TEntity, change: TChange, request: IRequest): Promise<boolean> {
    return await this.checkEntityChange(entity, change, request);
  }

  protected checkEntityChange(entity: TEntity, change: TChange, request: IRequest): Promise<boolean> {
    return Promise.resolve(this.checkEntityChangeSync(entity, change, request));
  }

  protected checkEntityChangeSync(entity: TEntity, change: TChange, request: IRequest): boolean {
    return true;
  }

  protected hasPermission(name: string, request: IRequest): boolean {
    return PermissionHelper.hasPermission(name, request.permissions);
  }

  abstract entityToModel(entity: TEntity): any;

  private async getSupplements(params: IParams, entities: TEntity[]): Promise<IObject> {
    const requestedSupplements = params.readStringArray('supplement') || [];

    if (requestedSupplements.length === 0)
      return undefined;

    const supplements: IObject = {};

    for (const requestedSupplement of requestedSupplements)
      supplements[requestedSupplement] = await this.getSupplement(requestedSupplement, entities);

    return supplements;
  }

  protected async getSupplement(name: string, entities: TEntity[]): Promise<any> {
    throw new Error('Not implemented.');
  }
}
