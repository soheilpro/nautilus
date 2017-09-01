import { IRepository } from '../irepository';
import { IUserLog } from './iuser-log';
import { IUserLogChange } from './iuser-log-change';

export interface IUserLogRepository extends IRepository<IUserLog, IUserLogChange> {
}
