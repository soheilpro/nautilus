import { ServiceBase } from '../service-base';
import { IItemRelationship } from './iitem-relationship';
import { IItemRelationshipChange } from './iitem-relationship-change';
import { IItemRelationshipFilter } from './iitem-relationship-filter';
import { IItemRelationshipGetResult } from './iitem-relationship-get-result';
import { IItemRelationshipService } from './iitem-relationship-service';
import { ItemRelationship } from './item-relationship';

export class ItemRelationshipService extends ServiceBase<IItemRelationship, IItemRelationshipFilter, IItemRelationshipChange, IItemRelationshipGetResult> implements IItemRelationshipService {
  basePath(): string {
    return '/item-relationships';
  }

  deserializeEntity(data: any): IItemRelationship {
    return new ItemRelationship(data);
  }

  serializeFilter(filter: IItemRelationshipFilter): Object {
    return undefined;
  }

  serializeEntity(entity: IItemRelationship): Object {
    return {
      item1_id: this.toId(entity.item1),
      item2_id: this.toId(entity.item2),
      type: entity.type,
    };
  }

  serializeChange(change: IItemRelationshipChange): Object {
    return {};
  }
}
