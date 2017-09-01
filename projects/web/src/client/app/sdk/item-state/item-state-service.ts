import { ServiceBase } from '../service-base';
import { IItemState } from './iitem-state';
import { IItemStateChange } from './iitem-state-change';
import { IItemStateFilter } from './iitem-state-filter';
import { IItemStateGetResult } from './iitem-state-get-result';
import { IItemStateService } from './iitem-state-service';

export class ItemStateService extends ServiceBase<IItemState, IItemStateFilter, IItemStateChange, IItemStateGetResult> implements IItemStateService {
  basePath(): string {
    return '/item-states';
  }

  serializeFilter(filter: IItemStateFilter): Object {
    return undefined;
  }

  serializeEntity(entity: IItemState): Object {
    return {
      itemKind: entity.itemKind,
      title: entity.title,
      key: entity.key,
      order: entity.order,
    };
  }

  serializeChange(change: IItemStateChange): Object {
    return {
      title: change.title,
      key: change.key,
      order: change.order,
    };
  }
}
