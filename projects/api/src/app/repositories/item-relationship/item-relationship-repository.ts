import { IFilter } from '../../framework';
import { IItemRelationship, IItemRelationshipChange, IItemRelationshipRepository, ItemItemRelationshipFilter } from '../../framework/item-relationship';
import { IDB } from '../../db';
import { IItemRelationshipDocument } from './iitem-relationship-document';
import RepositoryBase from '../repository-base';

export class ItemRelationshipRepository extends RepositoryBase<IItemRelationship, IItemRelationshipChange, IItemRelationshipDocument> implements IItemRelationshipRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'itemRelationships';
  }

  filterToQuery(filter: IFilter) {
    if (filter instanceof ItemItemRelationshipFilter) {
      const entityIds = filter.items.map(item => this.toObjectId(item.id));

      return {
        $or: [
          { 'item1._id': { $in: entityIds } },
          { 'item2._id': { $in: entityIds } },
        ],
      };
    }

    return super.filterToQuery(filter);
  }

  changeToUpdate(change: IItemRelationshipChange) {
    const update = super.changeToUpdate(change);
    update.setOrUnset('item1', change.item1, this.toRef);
    update.setOrUnset('item2', change.item2, this.toRef);
    update.setOrUnset('type', change.type);

    return update;
  }

  documentToEntity(document: IItemRelationshipDocument) {
    return {
      ...super.documentToEntity(document),
      item1: this.fromRef(document.item1),
      item2: this.fromRef(document.item2),
      type: document.type,
    };
  }

  entityToDocument(entity: IItemRelationship) {
    return {
      ...super.entityToDocument(entity),
      item1: this.toRef(entity.item1),
      item2: this.toRef(entity.item2),
      type: entity.type,
    };
  }
}
