import { IManager } from '../imanager';
import { ISession } from './isession';
import { ISessionChange } from './isession-change';

export interface ISessionManager extends IManager<ISession, ISessionChange> {
}
