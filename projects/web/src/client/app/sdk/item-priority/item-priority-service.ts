import { ServiceBase } from '../service-base';
import { IItemPriority } from './iitem-priority';
import { IItemPriorityChange } from './iitem-priority-change';
import { IItemPriorityFilter } from './iitem-priority-filter';
import { IItemPriorityGetResult } from './iitem-priority-get-result';
import { IItemPriorityService } from './iitem-priority-service';
import { ItemPriority } from './item-priority';

export class ItemPriorityService extends ServiceBase<IItemPriority, IItemPriorityFilter, IItemPriorityChange, IItemPriorityGetResult> implements IItemPriorityService {
  basePath(): string {
    return '/item-priorities';
  }

  deserializeEntity(data: any): IItemPriority {
    return new ItemPriority(data);
  }

  serializeFilter(filter: IItemPriorityFilter): Object {
    return undefined;
  }

  serializeEntity(entity: IItemPriority): Object {
    return {
      itemKind: entity.itemKind,
      title: entity.title,
      key: entity.key,
      order: entity.order,
    };
  }

  serializeChange(change: IItemPriorityChange): Object {
    return {
      title: change.title,
      key: change.key,
      order: change.order,
    };
  }
}
