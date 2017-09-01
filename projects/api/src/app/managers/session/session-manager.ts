import * as crypto from 'crypto';
import { ISession, ISessionChange, ISessionManager, ISessionRepository } from '../../framework/session';
import ManagerBase from '../manager-base';

export class SessionManager extends ManagerBase<ISession, ISessionChange> implements ISessionManager {
  constructor(repository: ISessionRepository) {
    super(repository);
  }

  insert(entity: ISession) {
    entity.accessToken = this.generateAccessToken(32);

    return super.insert(entity);
  }

  validateEntity(entity: ISession) {
    if (entity.user === undefined)
      return { message: 'Missing user.' };

    if (entity.user === null)
      return { message: 'Invalid user.' };

    return null;
  }

  generateAccessToken(length: number) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  }
}
