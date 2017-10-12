import { ServiceBase } from '../service-base';
import { IItemType } from './iitem-type';
import { IItemTypeChange } from './iitem-type-change';
import { IItemTypeFilter } from './iitem-type-filter';
import { IItemTypeGetResult } from './iitem-type-get-result';
import { IItemTypeService } from './iitem-type-service';
import { ItemType } from './item-type';

export class ItemTypeService extends ServiceBase<IItemType, IItemTypeFilter, IItemTypeChange, IItemTypeGetResult> implements IItemTypeService {
  basePath(): string {
    return '/item-types';
  }

  deserializeEntity(data: any): IItemType {
    return new ItemType(data);
  }

  serializeFilter(filter: IItemTypeFilter): Object {
    return undefined;
  }

  serializeEntity(entity: IItemType): Object {
    return {
      itemKind: entity.itemKind,
      title: entity.title,
      key: entity.key,
      order: entity.order,
    };
  }

  serializeChange(change: IItemTypeChange): Object {
    return {
      title: change.title,
      key: change.key,
      order: change.order,
    };
  }
}
