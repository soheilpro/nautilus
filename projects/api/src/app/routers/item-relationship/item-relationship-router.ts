import { RouterBase } from '../router-base';
import { IItemRelationship, IItemRelationshipManager, IItemRelationshipChange } from '../../framework/item-relationship';
import { IItem, IItemManager } from '../../framework/item';
import { IUserLogManager } from '../../framework/user-log';
import { EntityHelper, EntityFilter } from '../../framework';
import { IDateTimeService } from '../../services';
import { ItemRelationshipModel } from '../../models';
import { IRequest, IParams } from '../../web';

export class ItemRelationshipRouter extends RouterBase<IItemRelationship, IItemRelationshipChange> {
  constructor(itemRelationshipManager: IItemRelationshipManager, private itemManager: IItemManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemRelationshipManager, userLogManager, dateTimeService);
  }

  readonly name = 'item-relationships';

  getRoutes() {
    return [
      this.protectedRoute('get',   '/item-relationships',     this.getEntities),
      this.protectedRoute('get',   '/item-relationships/:id', this.getEntity),
      this.protectedRoute('post',  '/item-relationships',     this.postEntity),
      this.protectedRoute('patch', '/item-relationships/:id', this.patchEntity),
      this.protectedRoute('del',   '/item-relationships/:id', this.deleteEntity),
    ];
  }

  async checkEntityAccess(entity: IItemRelationship, access: string, request: IRequest) {
    switch (access) {
      case 'create':
      case 'read':
      case 'update':
      case 'delete':
        return await this.checkItemUpdateAccess(entity.item1, request) &&
               await this.checkItemUpdateAccess(entity.item2, request);

      default:
        throw new Error('Not supported.');
    }
  }

  async checkEntityChange(entity: IItemRelationship, change: IItemRelationshipChange, request: IRequest) {
    if (change.item1)
      if (!(await this.checkItemUpdateAccess(change.item1, request)))
        return false;

    if (change.item2)
      if (!(await this.checkItemUpdateAccess(change.item2, request)))
        return false;

    return true;
  }

  private async checkItemUpdateAccess(item: IItem, request: IRequest) {
    if (!item)
      return false;

    if (this.checkEntityPermisisons('items', item, 'update', request))
      return true;

    if (EntityHelper.isBareEntity(item))
      item = await this.itemManager.get(new EntityFilter(item.id));

    if (item.project)
      return this.hasPermission(`projects.${item.project.id}.items:modify`, request);
    else
      return item.createdBy.id === request.user.id;
  }

  async entityFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.entityFromParams(params, request),
      item1: await params.readEntity('item1_id', this.itemManager),
      item2: await params.readEntity('item2_id', this.itemManager),
      type: params.readString('type'),
    };
  }

  async changeFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.changeFromParams(params, request),
      item1: await params.readEntity('item1_id', this.itemManager),
      item2: await params.readEntity('item2_id', this.itemManager),
      type: params.readString('type'),
    };
  }

  entityToModel(entity: IItemRelationship) {
    if (!entity)
      return undefined;

    return new ItemRelationshipModel(entity);
  }
}
