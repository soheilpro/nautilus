import { IService } from '../iservice';
import { ISession } from './isession';
import { ISessionChange } from './isession-change';
import { ISessionFilter } from './isession-filter';
import { ISessionGetResult } from './isession-get-result';

export interface ISessionService extends IService<ISession, ISessionFilter, ISessionChange, ISessionGetResult> {
  create(username: string, password: string): Promise<ISession>;
}
