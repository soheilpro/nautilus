import { IItemRelationship, IItemRelationshipChange, IItemRelationshipManager, IItemRelationshipRepository } from '../../framework/item-relationship';
import ManagerBase from '../manager-base';

const TypeRegEx = /.+/;

export class ItemRelationshipManager extends ManagerBase<IItemRelationship, IItemRelationshipChange> implements IItemRelationshipManager {
  constructor(repository: IItemRelationshipRepository) {
    super(repository);
  }

  validateEntity(entity: IItemRelationship) {
    if (entity.item1 === undefined)
      return { message: 'Missing item1.' };

    if (entity.item1 === null)
      return { message: 'Missing item1.' };

    if (entity.item2 === undefined)
      return { message: 'Missing item2.' };

    if (entity.item2 === null)
      return { message: 'Missing item2.' };

    if (entity.type === undefined)
      return { message: 'Missing type.' };

    if (!TypeRegEx.test(entity.type))
      return { message: 'Invalid type.' };

    return null;
  }

  validateChange(change: IItemRelationship) {
    if (change.item1 !== undefined) {
      if (change.item1 === null)
        return { message: 'Requires item1.' };
    }

    if (change.item2 !== undefined) {
      if (change.item2 === null)
        return { message: 'Requires item2.' };
    }

    if (change.type !== undefined) {
      if (!TypeRegEx.test(change.type))
        return { message: 'Invalid type.' };
    }

    return null;
  }
}
