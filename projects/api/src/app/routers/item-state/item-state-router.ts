import { RouterBase } from '../router-base';
import { IItemState, IItemStateManager, IItemStateChange } from '../../framework/item-state';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { ItemStateModel } from '../../models';
import { IRequest, IParams } from '../../web';
import { IRoute } from '../iroute';

export class ItemStateRouter extends RouterBase<IItemState, IItemStateChange> {
  constructor(itemStateManager: IItemStateManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemStateManager, userLogManager, dateTimeService);
  }

  readonly name = 'item-states';

  getRoutes(): IRoute[] {
    return [
      this.protectedRoute('get',   '/item-states',     this.getEntities),
      this.protectedRoute('get',   '/item-states/:id', this.getEntity),
      this.protectedRoute('post',  '/item-states',     this.postEntity),
      this.protectedRoute('patch', '/item-states/:id', this.patchEntity),
      this.protectedRoute('del',   '/item-states/:id', this.deleteEntity),
    ];
  }

  async entityFromParams(params: IParams, request: IRequest): Promise<IItemState> {
    return {
      ...await super.entityFromParams(params, request),
      itemKind: params.readString('item_kind'),
      title: params.readString('title'),
      key: params.readString('key'),
      order: params.readInt('order'),
    };
  }

  async changeFromParams(params: IParams, request: IRequest): Promise<IItemStateChange> {
    return {
      ...await super.changeFromParams(params, request),
      itemKind: params.readString('item_kind'),
      title: params.readString('title'),
      key: params.readString('key'),
      order: params.readInt('order'),
    };
  }

  entityToModel(entity: IItemState): ItemStateModel {
    if (!entity)
      return undefined;

    return new ItemStateModel(entity);
  }
}
