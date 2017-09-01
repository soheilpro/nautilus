import { IRepository } from '../irepository';
import { IUser } from './iuser';
import { IUserChange } from './iuser-change';

export interface IUserRepository extends IRepository<IUser, IUserChange> {
}
