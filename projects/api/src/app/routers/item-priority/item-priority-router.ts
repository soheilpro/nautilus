import { RouterBase } from '../router-base';
import { IItemPriority, IItemPriorityManager, IItemPriorityChange } from '../../framework/item-priority';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { ItemPriorityModel } from '../../models';
import { IRequest, IParams } from '../../web';
import { IRoute } from '../iroute';

export class ItemPriorityRouter extends RouterBase<IItemPriority, IItemPriorityChange> {
  constructor(itemPriorityManager: IItemPriorityManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemPriorityManager, userLogManager, dateTimeService);
  }

  readonly name = 'item-priorities';

  getRoutes(): IRoute[] {
    return [
      this.protectedRoute('get',   '/item-priorities',     this.getEntities),
      this.protectedRoute('get',   '/item-priorities/:id', this.getEntity),
      this.protectedRoute('post',  '/item-priorities',     this.postEntity),
      this.protectedRoute('patch', '/item-priorities/:id', this.patchEntity),
      this.protectedRoute('del',   '/item-priorities/:id', this.deleteEntity),
    ];
  }

  async entityFromParams(params: IParams, request: IRequest): Promise<IItemPriority> {
    return {
      ...await super.entityFromParams(params, request),
      itemKind: params.readString('item_kind'),
      title: params.readString('title'),
      key: params.readString('key'),
      order: params.readInt('order'),
    };
  }

  async changeFromParams(params: IParams, request: IRequest): Promise<IItemPriorityChange> {
    return {
      ...await super.changeFromParams(params, request),
      itemKind: params.readString('item_kind'),
      title: params.readString('title'),
      key: params.readString('key'),
      order: params.readInt('order'),
    };
  }

  entityToModel(entity: IItemPriority): ItemPriorityModel {
    if (!entity)
      return undefined;

    return new ItemPriorityModel(entity);
  }
}
