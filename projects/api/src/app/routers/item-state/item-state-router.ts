import { RouterBase } from '../router-base';
import { IItemState, IItemStateManager, IItemStateChange } from '../../framework/item-state';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { ItemStateModel } from '../../models';
import { IRequest, IParams } from '../../web';

export class ItemStateRouter extends RouterBase<IItemState, IItemStateChange> {
  constructor(itemStateManager: IItemStateManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemStateManager, userLogManager, dateTimeService);
  }

  readonly name = 'item-states';

  getRoutes() {
    return [
      this.protectedRoute('get',   '/item-states',     this.getEntities),
      this.protectedRoute('get',   '/item-states/:id', this.getEntity),
      this.protectedRoute('post',  '/item-states',     this.postEntity),
      this.protectedRoute('patch', '/item-states/:id', this.patchEntity),
      this.protectedRoute('del',   '/item-states/:id', this.deleteEntity),
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

  entityToModel(entity: IItemState) {
    if (!entity)
      return undefined;

    return new ItemStateModel(entity);
  }
}
