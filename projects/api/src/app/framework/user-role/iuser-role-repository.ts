import { IRepository } from '../irepository';
import { IUserRole } from './iuser-role';
import { IUserRoleChange } from './iuser-role-change';

export interface IUserRoleRepository extends IRepository<IUserRole, IUserRoleChange> {
}
