import { IFilter } from '../../framework';
import { IItemType, IItemTypeChange, IItemTypeRepository, DuplicateItemTypeFilter } from '../../framework/item-type';
import { IDB } from '../../db';
import { IItemTypeDocument } from './iitem-type-document';
import RepositoryBase from '../repository-base';

export class ItemTypeRepository extends RepositoryBase<IItemType, IItemTypeChange, IItemTypeDocument> implements IItemTypeRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'itemTypes';
  }

  filterToQuery(filter: IFilter) {
    if (filter instanceof DuplicateItemTypeFilter) {
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

  changeToUpdate(change: IItemTypeChange) {
    const update = super.changeToUpdate(change);
    update.setOrUnset('itemKind', change.itemKind);
    update.setOrUnset('title', change.title);
    update.setOrUnset('key', change.key);
    update.setOrUnset('order', change.order);

    return update;
  }

  documentToEntity(document: IItemTypeDocument) {
    return {
      ...super.documentToEntity(document),
      itemKind: document.itemKind,
      title: document.title,
      key: document.key,
      order: document.order,
    };
  }

  entityToDocument(entity: IItemType) {
    return {
      ...super.entityToDocument(entity),
      itemKind: entity.itemKind,
      title: entity.title,
      key: entity.key,
      order: entity.order,
    };
  }
}
