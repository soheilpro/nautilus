import { ServiceBase } from '../service-base';
import { ISession } from './isession';
import { ISessionChange } from './isession-change';
import { ISessionFilter } from './isession-filter';
import { ISessionGetResult } from './isession-get-result';
import { ISessionService } from './isession-service';
import { Session } from './session';

export class SessionService extends ServiceBase<ISession, ISessionFilter, ISessionChange, ISessionGetResult> implements ISessionService {
  basePath(): string {
    return '/sessions';
  }

  deserializeEntity(data: any): ISession {
    return new Session(data);
  }

  serializeFilter(filter: ISessionFilter): Object {
    return undefined;
  }

  serializeEntity(entity: ISession): Object {
    return undefined;
  }

  serializeChange(change: ISessionChange): Object {
    return undefined;
  }

  async create(username: string, password: string) {
    const invokeOptions = {
      method: 'POST',
      path: this.basePath(),
      data: {
        username: username,
        password: password,
      },
    };

    return (await this.invoke(invokeOptions)).data.data;
  }
}
