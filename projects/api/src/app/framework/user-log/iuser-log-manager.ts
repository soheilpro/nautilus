import { IManager } from '../imanager';
import { IUserLog } from './iuser-log';
import { IUserLogChange } from './iuser-log-change';

export interface IUserLogManager extends IManager<IUserLog, IUserLogChange> {
}
