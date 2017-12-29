import * as crypto from 'crypto';
import { ISession, ISessionChange, ISessionManager, ISessionRepository } from '../../framework/session';
import { IValidationError } from '../../framework';
import { ManagerBase } from '../manager-base';

export class SessionManager extends ManagerBase<ISession, ISessionChange> implements ISessionManager {
  constructor(repository: ISessionRepository) {
    super(repository);
  }

  insert(entity: ISession): Promise<ISession> {
    entity.accessToken = this.generateAccessToken(32);

    return super.insert(entity);
  }

  validateEntity(entity: ISession): IValidationError {
    if (entity.user === undefined)
      return { message: 'Missing user.' };

    if (entity.user === null)
      return { message: 'Invalid user.' };

    return null;
  }

  generateAccessToken(length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  }
}
