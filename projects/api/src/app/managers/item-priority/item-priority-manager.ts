import { IItemPriority, IItemPriorityChange, IItemPriorityManager, IItemPriorityRepository, DuplicateItemPriorityFilter } from '../../framework/item-priority';
import { IValidationError, IFilter } from '../../framework';
import { ManagerBase } from '../manager-base';

const ItemKindRegEx = /.+/;
const TitleRegEx = /.+/;
const KeyRegEx = /.+/;

export class ItemPriorityManager extends ManagerBase<IItemPriority, IItemPriorityChange> implements IItemPriorityManager {
  constructor(repository: IItemPriorityRepository) {
    super(repository);
  }

  validateEntity(entity: IItemPriority): IValidationError {
    if (entity.itemKind === undefined)
      return { message: 'Missing itemKind.' };

    if (!ItemKindRegEx.test(entity.itemKind))
      return { message: 'Invalid itemKind.' };

    if (entity.title === undefined)
      return { message: 'Missing title.' };

    if (!TitleRegEx.test(entity.title))
      return { message: 'Invalid title.' };

    if (entity.key === undefined)
      return { message: 'Missing key.' };

    if (!KeyRegEx.test(entity.key))
      return { message: 'Invalid key.' };

    if (entity.order === undefined)
      return { message: 'Missing order.' };

    if (isNaN(entity.order))
      return { message: 'Invalid order.' };

    if (entity.order < 0)
      return { message: 'Invalid order.' };

    return null;
  }

  validateChange(change: IItemPriority): IValidationError {
    if (change.itemKind !== undefined) {
      if (!ItemKindRegEx.test(change.itemKind))
        return { message: 'Invalid itemKind.' };
    }

    if (change.title !== undefined) {
      if (!TitleRegEx.test(change.title))
        return { message: 'Invalid title.' };
    }

    if (change.key !== undefined) {
      if (!KeyRegEx.test(change.key))
        return { message: 'Invalid key.' };
    }

    if (change.order !== undefined) {
      if (isNaN(change.order))
        return { message: 'Invalid order.' };

      if (change.order < 0)
        return { message: 'Invalid order.' };
    }

    return null;
  }

  getEntityDuplicateCheckFilter(entity: IItemPriority): IFilter {
    return new DuplicateItemPriorityFilter(entity.key);
  }

  getChangeDuplicateCheckFilter(change: IItemPriorityChange): IFilter {
    return new DuplicateItemPriorityFilter(change.key);
  }
}
