import { IFilter } from '../../framework';
import { ISession, ISessionChange, ISessionRepository, SessionFilter } from '../../framework/session';
import { IDB } from '../../db';
import { ISessionDocument } from './isession-document';
import RepositoryBase from '../repository-base';

export class SessionRepository extends RepositoryBase<ISession, ISessionChange, ISessionDocument> implements ISessionRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'sessions';
  }

  filterToQuery(filter: IFilter) {
    if (filter instanceof SessionFilter) {
      return {
        accessToken: filter.accessToken,
        user: {
          _id: this.toObjectId(filter.user.id),
        },
      };
    }

    return super.filterToQuery(filter);
  }

  documentToEntity(document: ISessionDocument) {
    return {
      ...super.documentToEntity(document),
      accessToken: document.accessToken,
      user: this.fromRef(document.user),
    };
  }

  entityToDocument(entity: ISession) {
    return {
      ...super.entityToDocument(entity),
      accessToken: entity.accessToken,
      user: this.toRef(entity.user),
    };
  }
}
