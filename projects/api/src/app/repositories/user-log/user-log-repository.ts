import { IUserLog, IUserLogChange, IUserLogRepository } from '../../framework/user-log';
import { IDB } from '../../db';
import { IUserLogDocument } from './iuser-log-document';
import RepositoryBase from '../repository-base';

export class UserLogRepository extends RepositoryBase<IUserLog, IUserLogChange, IUserLogDocument> implements IUserLogRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'userLogs';
  }

  documentToEntity(document: IUserLogDocument) {
    return {
      ...super.documentToEntity(document),
      dateTime: document.dateTime,
      user: this.fromRef(document.user),
      action: document.action,
      item: this.fromRef(document.item),
      params: document.params,
    };
  }

  entityToDocument(entity: IUserLog) {
    return {
      ...super.entityToDocument(entity),
      dateTime: entity.dateTime,
      user: this.toRef(entity.user),
      action: entity.action,
      item: this.toRef(entity.item),
      params: entity.params,
    };
  }
}
