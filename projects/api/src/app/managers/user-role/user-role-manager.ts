import { IUserRole, IUserRoleChange, IUserRoleManager, IUserRoleRepository } from '../../framework/user-role';
import { IValidationError } from '../../framework';
import { ManagerBase } from '../manager-base';

const NameRegEx = /.+/;

export class UserRoleManager extends ManagerBase<IUserRole, IUserRoleChange> implements IUserRoleManager {
  constructor(repository: IUserRoleRepository) {
    super(repository);
  }

  validateEntity(entity: IUserRole): IValidationError {
    if (entity.user === undefined)
      return { message: 'Missing user.' };

    if (entity.user === null)
      return { message: 'Missing user.' };

    if (entity.role === undefined)
      return { message: 'Missing role.' };

    if (!NameRegEx.test(entity.role))
      return { message: 'Invalid role.' };

    if (entity.role.startsWith('project.')) {
      if (entity.project === undefined) {
        return { message: 'Project is required.' };
      }
      else {
        if (entity.project === null)
          return { message: 'Invalid project.' };
      }
    }
    else {
      if (entity.project !== undefined) {
        return { message: 'Project is not required.' };
      }
    }

    return null;
  }

  validateChange(change: IUserRoleChange): IValidationError {
    if (change.user !== undefined) {
      if (change.user === null)
        return { message: 'Requires user.' };
    }

    if (change.role !== undefined) {
      if (!NameRegEx.test(change.role))
        return { message: 'Invalid role.' };
    }

    return null;
  }
}
