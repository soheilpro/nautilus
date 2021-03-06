import { IFilter } from '../../framework';
import { IUserRole, IUserRoleChange, IUserRoleRepository, UserRoleFilter } from '../../framework/user-role';
import { IDB, IUpdate } from '../../db';
import { IUserRoleDocument } from './iuser-role-document';
import { RepositoryBase } from '../repository-base';

export class UserRoleRepository extends RepositoryBase<IUserRole, IUserRoleChange, IUserRoleDocument> implements IUserRoleRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName(): string {
    return 'userRoles';
  }

  filterToQuery(filter: IFilter): IObject {
    if (filter instanceof UserRoleFilter) {
      return {
        user: {
          _id: this.toObjectId(filter.user.id),
        },
      };
    }

    return super.filterToQuery(filter);
  }

  changeToUpdate(change: IUserRoleDocument): IUpdate {
    const update = super.changeToUpdate(change);
    update.setOrUnset('user', change.user, this.toRef);
    update.setOrUnset('role', change.role);
    update.setOrUnset('project', change.project, this.toRef);

    return update;
  }

  documentToEntity(document: IUserRoleDocument): IUserRole {
    return {
      ...super.documentToEntity(document),
      user: this.fromRef(document.user),
      role: document.role,
      project: this.fromRef(document.project),
    };
  }

  entityToDocument(entity: IUserRole): IUserRoleDocument {
    return {
      ...super.entityToDocument(entity),
      user: this.toRef(entity.user),
      role: entity.role,
      project: this.toRef(entity.project),
    };
  }
}
