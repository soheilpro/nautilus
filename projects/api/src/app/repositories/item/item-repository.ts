import { IItem, IItemChange, IItemRepository } from '../../framework/item';
import { IDB, IUpdate } from '../../db';
import { IItemDocument } from './iitem-document';
import { RepositoryBase } from '../repository-base';

export class ItemRepository extends RepositoryBase<IItem, IItemChange, IItemDocument> implements IItemRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName(): string {
    return 'items';
  }

  changeToUpdate(change: IItemChange): IUpdate {
    const update = super.changeToUpdate(change);
    update.setOrUnset('type', change.type, this.toRef);
    update.setOrUnset('kind', change.kind);
    update.setOrUnset('title', change.title);
    update.setOrUnset('description', change.description);
    update.setOrUnset('priority', change.priority, this.toRef);
    update.setOrUnset('state', change.state, this.toRef);
    update.setOrUnset('tags', change.tags);
    update.setOrUnset('project', change.project, this.toRef);
    update.setOrUnset('assignedTo', change.assignedTo, this.toRef);
    update.setOrUnset('modifiedBy', change.modifiedBy, this.toRef);

    return update;
  }

  documentToEntity(document: IItemDocument): IItem {
    return {
      ...super.documentToEntity(document),
      sid: document.sid,
      kind: document.kind,
      type: this.fromRef(document.type),
      title: document.title,
      description: document.description,
      priority: this.fromRef(document.priority),
      state: this.fromRef(document.state),
      tags: document.tags,
      project: this.fromRef(document.project),
      assignedTo: this.fromRef(document.assignedTo),
      createdBy: this.fromRef(document.createdBy),
      modifiedBy: this.fromRef(document.modifiedBy),
    };
  }

  entityToDocument(entity: IItem): IItemDocument {
    return {
      ...super.entityToDocument(entity),
      sid: entity.sid,
      kind: entity.kind,
      type: this.toRef(entity.type),
      title: entity.title,
      description: entity.description,
      priority: this.toRef(entity.priority),
      state: this.toRef(entity.state),
      tags: entity.tags,
      project: this.toRef(entity.project),
      assignedTo: this.toRef(entity.assignedTo),
      createdBy: this.toRef(entity.createdBy),
      modifiedBy: this.toRef(entity.modifiedBy),
    };
  }
}
