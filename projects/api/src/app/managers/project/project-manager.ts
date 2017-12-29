import { IProject, IProjectChange, IProjectManager, IProjectRepository, DuplicateProjectFilter } from '../../framework/project';
import { IValidationError, IFilter } from '../../framework';
import { ManagerBase } from '../manager-base';

const NameRegEx = /.+/;

export class ProjectManager extends ManagerBase<IProject, IProjectChange> implements IProjectManager {
  constructor(repository: IProjectRepository) {
    super(repository);
  }

  validateEntity(entity: IProject): IValidationError {
    if (entity.name === undefined)
      return { message: 'Missing name.' };

    if (!NameRegEx.test(entity.name))
      return { message: 'Invalid name.' };

    return null;
  }

  validateChange(change: IProjectChange): IValidationError {
    if (change.name !== undefined) {
      if (!NameRegEx.test(change.name))
        return { message: 'Invalid name.' };
    }

    return null;
  }

  getEntityDuplicateCheckFilter(entity: IProject): IFilter {
    return new DuplicateProjectFilter(entity.name);
  }

  getChangeDuplicateCheckFilter(change: IProjectChange): IFilter {
    return new DuplicateProjectFilter(change.name);
  }
}
