import * as bcrypt from 'bcryptjs';
import { IUser, IUserChange, IUserManager, IUserRepository, DuplicateUserFilter } from '../../framework/user';
import ManagerBase from '../manager-base';

const UsernameRegEx = /[a-zA-Z][a-zA-Z0-9.]{1,}/;
const PasswordRegEx = /\w{8,}/;
const NameRegEx = /.+/;
const EMailRegEx = /\w+@\w+/;

export class UserManager extends ManagerBase<IUser, IUserChange> implements IUserManager {
  constructor(repository: IUserRepository) {
    super(repository);
  }

  insert(entity: IUser) {
    entity.passwordHash = this.hashPassword(entity.password);

    return super.insert(entity);
  }

  update(id: string, change: IUserChange) {
    if (change.password !== undefined)
      change.passwordHash = this.hashPassword(change.password);

    return super.update(id, change);
  }

  validateEntity(entity: IUser) {
    if (entity.username === undefined)
      return { message: 'Missing username.' };

    if (!UsernameRegEx.test(entity.username))
      return { message: 'Invalid username.' };

    if (entity.password === undefined)
      return { message: 'Missing password.' };

    if (!PasswordRegEx.test(entity.password))
      return { message: 'Invalid password.' };

    if (entity.name === undefined)
      return { message: 'Missing name.' };

    if (!NameRegEx.test(entity.name))
      return { message: 'Invalid name.' };

    if (entity.email === undefined)
      return { message: 'Missing email.' };

    if (!EMailRegEx.test(entity.email))
      return { message: 'Invalid email.' };

    return null;
  }

  validateChange(change: IUserChange) {
    if (change.username !== undefined) {
      if (!UsernameRegEx.test(change.username))
        return { message: 'Invalid username.' };
    }

    if (change.password !== undefined) {
      if (!PasswordRegEx.test(change.password))
        return { message: 'Invalid password.' };
    }

    if (change.name !== undefined) {
      if (!NameRegEx.test(change.name))
        return { message: 'Invalid name.' };
    }

    if (change.email !== undefined) {
      if (!EMailRegEx.test(change.email))
        return { message: 'Invalid email.' };
    }

    return null;
  }

  getEntityDuplicateCheckFilter(entity: IUser) {
    return new DuplicateUserFilter(entity.username, entity.email);
  }

  getChangeDuplicateCheckFilter(change: IUserChange) {
    return new DuplicateUserFilter(change.username, change.email);
  }

  private hashPassword(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  testPassword(password: string, passwordHash: string) {
    return bcrypt.compareSync(password, passwordHash);
  }
}
