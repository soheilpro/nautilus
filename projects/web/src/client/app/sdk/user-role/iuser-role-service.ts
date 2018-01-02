import { IService } from '../iservice';
import { IUserRole } from './iuser-role';
import { IUserRoleChange } from './iuser-role-change';
import { IUserRoleFilter } from './iuser-role-filter';
import { IUserRoleGetResult } from './iuser-role-get-result';

export interface IUserRoleService extends IService<IUserRole, IUserRoleFilter, IUserRoleChange, IUserRoleGetResult> {
}
