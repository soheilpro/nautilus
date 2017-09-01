import { IRepository } from '../irepository';
import { ISession } from './isession';
import { ISessionChange } from './isession-change';

export interface ISessionRepository extends IRepository<ISession, ISessionChange> {
}
