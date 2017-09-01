import { IFilter } from '../../framework';
import { IUser, IUserChange, IUserRepository, UserFilter, DuplicateUserFilter } from '../../framework/user';
import { IDB } from '../../db';
import { IUserDocument } from './iuser-document';
import RepositoryBase from '../repository-base';

export class UserRepository extends RepositoryBase<IUser, IUserChange, IUserDocument> implements IUserRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'users';
  }

  filterToQuery(filter: IFilter) {
    if (filter instanceof UserFilter) {
      return {
        username: filter.username,
      };
    }

    if (filter instanceof DuplicateUserFilter) {
      const predicates = [];

      if (filter.username) {
        predicates.push({
          username: filter.username,
        });
      }

      if (filter.email) {
        predicates.push({
          email: filter.email,
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

  changeToUpdate(change: IUserChange) {
    const update = super.changeToUpdate(change);
    update.setOrUnset('username', change.username);
    update.setOrUnset('passwordHash', change.passwordHash);
    update.setOrUnset('name', change.name);
    update.setOrUnset('email', change.email);

    return update;
  }

  documentToEntity(document: IUserDocument) {
    return {
      ...super.documentToEntity(document),
      username: document.username,
      passwordHash: document.passwordHash,
      name: document.name,
      email: document.email,
    };
  }

  entityToDocument(entity: IUser) {
    return {
      ...super.entityToDocument(entity),
      username: entity.username,
      passwordHash: entity.passwordHash,
      name: entity.name,
      email: entity.email,
    };
  }
}
