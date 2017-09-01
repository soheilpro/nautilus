import { RouterBase } from '../router-base';
import { IItemType, IItemTypeManager, IItemTypeChange } from '../../framework/item-type';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { ItemTypeModel } from '../../models';
import { IRequest, IParams } from '../../web';

export class ItemTypeRouter extends RouterBase<IItemType, IItemTypeChange> {
  constructor(itemTypeManager: IItemTypeManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemTypeManager, userLogManager, dateTimeService);
  }

  readonly name = 'item-types';

  getRoutes() {
    return [
      this.protectedRoute('get',   '/item-types',     this.getEntities),
      this.protectedRoute('get',   '/item-types/:id', this.getEntity),
      this.protectedRoute('post',  '/item-types',     this.postEntity),
      this.protectedRoute('patch', '/item-types/:id', this.patchEntity),
      this.protectedRoute('del',   '/item-types/:id', this.deleteEntity),
    ];
  }

  async entityFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.entityFromParams(params, request),
      itemKind: params.readString('item_kind'),
      title: params.readString('title'),
      key: params.readString('key'),
      order: params.readInt('order'),
    };
  }

  async changeFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.changeFromParams(params, request),
      itemKind: params.readString('item_kind'),
      title: params.readString('title'),
      key: params.readString('key'),
      order: params.readInt('order'),
    };
  }

  entityToModel(entity: IItemType) {
    if (!entity)
      return undefined;

    return new ItemTypeModel(entity);
  }
}
