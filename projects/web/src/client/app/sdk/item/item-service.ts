import { ServiceBase } from '../service-base';
import { IItem } from './iitem';
import { IItemChange } from './iitem-change';
import { IItemFilter } from './iitem-filter';
import { IItemGetResult } from './iitem-get-result';

import { IItemService } from './iitem-service';

export class ItemService extends ServiceBase<IItem, IItemFilter, IItemChange, IItemGetResult> implements IItemService {
  basePath(): string {
    return '/items';
  }

  serializeFilter(filter: IItemFilter): Object {
    return {
      type: filter.type,
    };
  }

  serializeEntity(entity: IItem): Object {
    return {
      kind: entity.kind,
      type_id: this.toId(entity.type),
      title: entity.title,
      description: entity.description,
      state_id: this.toId(entity.state),
      tags: entity.tags ? entity.tags.join(' ') : undefined,
      project_id: this.toId(entity.project),
      assigned_to_id: this.toId(entity.assignedTo),
    };
  }

  serializeChange(change: IItemChange): Object {
    return {
      type_id: this.toId(change.type),
      title: change.title,
      description: change.description,
      state_id: this.toId(change.state),
      tags: change.tags ? change.tags.join(' ') : undefined,
      project_id: this.toId(change.project),
      assigned_to_id: this.toId(change.assignedTo),
    };
  }

  protected deserializeGetResult(data: any): IItemGetResult {
    const result: IItemGetResult = {
      ...super.deserializeGetResult(data),
      relationships: data.supplements.relationships,
    };

    return result;
  }
}
