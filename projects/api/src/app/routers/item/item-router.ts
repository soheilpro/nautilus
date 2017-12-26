import { RouterBase } from '../router-base';
import { IItem, IItemManager, IItemChange } from '../../framework/item';
import { IProjectManager } from '../../framework/project';
import { IItemTypeManager } from '../../framework/item-type';
import { IItemStateManager } from '../../framework/item-state';
import { IItemRelationshipManager, ItemItemRelationshipFilter } from '../../framework/item-relationship';
import { IUserManager } from '../../framework/user';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { ItemModel, ItemRelationshipModel } from '../../models';
import { IRequest, IParams } from '../../web';
import { IRoute } from '../iroute';

export class ItemRouter extends RouterBase<IItem, IItemChange> {
  constructor(itemManager: IItemManager, private userManager: IUserManager, private projectManager: IProjectManager, private itemTypeManager: IItemTypeManager, private itemStateManager: IItemStateManager, private itemRelationshipManager: IItemRelationshipManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemManager, userLogManager, dateTimeService);
  }

  readonly name = 'items';

  getRoutes(): IRoute[] {
    return [
      this.protectedRoute('get',   '/items',     this.getEntities),
      this.protectedRoute('get',   '/items/:id', this.getEntity),
      this.protectedRoute('post',  '/items',     this.postEntity),
      this.protectedRoute('patch', '/items/:id', this.patchEntity),
      this.protectedRoute('del',   '/items/:id', this.deleteEntity),
    ];
  }

  checkEntityAccessSync(entity: IItem, access: string, request: IRequest): boolean {
    switch (access) {
      case 'create':
        if (entity.project)
          return this.hasPermission(`projects.${entity.project.id}.items:modify`, request);
        else
          return true;

      case 'read':
        if (entity.project)
          return this.hasPermission(`projects.${entity.project.id}.items:read`, request);
        else
          return entity.createdBy.id === request.user.id;

      case 'update':
      case 'delete':
        if (entity.project)
          return this.hasPermission(`projects.${entity.project.id}.items:modify`, request);
        else
          return entity.createdBy.id === request.user.id;

      default:
        throw new Error('Not supported.');
    }
  }

  checkChangeSync(entity: IItem, change: IItemChange, request: IRequest): boolean {
    if (change.project)
      return this.hasPermission(`projects.${change.project.id}.items:modify`, request);
    else
      return true;
  }

  async getSupplement(name: string, entities: IItem[]): Promise<IObject> {
    if (name === 'relationships') {
      const relationships = await this.itemRelationshipManager.getAll(new ItemItemRelationshipFilter(entities));

      return relationships.map(relationship => new ItemRelationshipModel(relationship));
    }

    return Promise.resolve(undefined);
  }

  async entityFromParams(params: IParams, request: IRequest): Promise<IItem> {
    return {
      ...await super.entityFromParams(params, request),
      kind: params.readString('kind'),
      type: await params.readEntity('type_id', this.itemTypeManager),
      title: params.readString('title'),
      description: params.readString('description'),
      state: await params.readEntity('state_id', this.itemStateManager),
      tags: params.readStringArray('tags'),
      project: await params.readEntity('project_id', this.projectManager),
      assignedTo: await params.readEntity('assigned_to_id', this.userManager),
      createdBy: request.user,
    };
  }

  async changeFromParams(params: IParams, request: IRequest): Promise<IItemChange> {
    return {
      ...await super.changeFromParams(params, request),
      kind: params.readString('kind'),
      type: await params.readEntity('type_id', this.itemTypeManager),
      title: params.readString('title'),
      description: params.readString('description'),
      state: await params.readEntity('state_id', this.itemStateManager),
      tags: params.readStringArray('tags'),
      project: await params.readEntity('project_id', this.projectManager),
      assignedTo: await params.readEntity('assigned_to_id', this.userManager),
      modifiedBy: request.user,
    };
  }

  entityToModel(entity: IItem): ItemModel {
    if (!entity)
      return undefined;

    return new ItemModel(entity);
  }
}
