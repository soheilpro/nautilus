import { IFilter } from '../../framework';
import { IItemPriority, IItemPriorityChange, IItemPriorityRepository, DuplicateItemPriorityFilter } from '../../framework/item-priority';
import { IDB, IUpdate } from '../../db';
import { IItemPriorityDocument } from './iitem-priority-document';
import { RepositoryBase } from '../repository-base';

export class ItemPriorityRepository extends RepositoryBase<IItemPriority, IItemPriorityChange, IItemPriorityDocument> implements IItemPriorityRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName(): string {
    return 'itemPriorities';
  }

  filterToQuery(filter: IFilter): IObject {
    if (filter instanceof DuplicateItemPriorityFilter) {
      const predicates = [];

      if (filter.key) {
        predicates.push({
          key: filter.key,
        });
      }

      if (predicates.length === 0)
        return null;

      return {
        $or: predicates,
      };
    }

    return super.filterToQuery(filter);
  }

  changeToUpdate(change: IItemPriorityChange): IUpdate {
    const update = super.changeToUpdate(change);
    update.setOrUnset('itemKind', change.itemKind);
    update.setOrUnset('title', change.title);
    update.setOrUnset('key', change.key);
    update.setOrUnset('order', change.order);

    return update;
  }

  documentToEntity(document: IItemPriorityDocument): IItemPriority {
    return {
      ...super.documentToEntity(document),
      itemKind: document.itemKind,
      title: document.title,
      key: document.key,
      order: document.order,
    };
  }

  entityToDocument(entity: IItemPriority): IItemPriorityDocument {
    return {
      ...super.entityToDocument(entity),
      itemKind: entity.itemKind,
      title: entity.title,
      key: entity.key,
      order: entity.order,
    };
  }
}
