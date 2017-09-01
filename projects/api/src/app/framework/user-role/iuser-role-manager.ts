import { IManager } from '../imanager';
import { IUserRole } from './iuser-role';
import { IUserRoleChange } from './iuser-role-change';

export interface IUserRoleManager extends IManager<IUserRole, IUserRoleChange> {
}
