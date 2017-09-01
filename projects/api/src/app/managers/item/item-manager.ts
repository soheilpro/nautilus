import { IItem, IItemChange, IItemManager, IItemRepository } from '../../framework/item';
import ManagerBase from '../manager-base';

const KindRegEx = /.+/;

export class ItemManager extends ManagerBase<IItem, IItemChange> implements IItemManager {
  constructor(repository: IItemRepository) {
    super(repository);
  }

  async insert(entity: IItem) {
    entity.sid = (await this.repository.counter('items.sid')).toString();

    return super.insert(entity);
  }

  validateEntity(entity: IItem) {
    if (entity.kind === undefined)
      return { message: 'Missing kind.' };

    if (!KindRegEx.test(entity.kind))
      return { message: 'Invalid kind.' };

    if (entity.type !== undefined) {
      if (entity.type === null)
        return { message: 'Invalid type.' };
    }

    if (entity.state !== undefined) {
      if (entity.state === null)
        return { message: 'Invalid state.' };
    }

    if (entity.project !== undefined) {
      if (entity.project === null)
        return { message: 'Invalid project.' };
    }

    if (entity.assignedTo !== undefined) {
      if (entity.assignedTo === null)
        return { message: 'Invalid assignedTo.' };
    }

    if (entity.createdBy === undefined)
      return { message: 'Missing createdBy.' };

    return null;
  }

  validateChange(change: IItemChange) {
    if (change.kind !== undefined)
      if (!KindRegEx.test(change.kind))
        return { message: 'Invalid kind.' };

    if (change.modifiedBy === undefined)
      return { message: 'Missing modifiedBy.' };

    return null;
  }
}
