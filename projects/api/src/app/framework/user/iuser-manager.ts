import { IManager } from '../imanager';
import { IUser } from './iuser';
import { IUserChange } from './iuser-change';

export interface IUserManager extends IManager<IUser, IUserChange> {
  testPassword(password: string, passwordHash: string): boolean;
}
