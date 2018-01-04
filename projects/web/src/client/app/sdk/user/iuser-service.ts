import { IService } from '../iservice';
import { IUser } from './iuser';
import { IUserChange } from './iuser-change';
import { IUserFilter } from './iuser-filter';
import { IUserGetResult } from './iuser-get-result';

export interface IUserService extends IService<IUser, IUserFilter, IUserChange, IUserGetResult> {
  getUserPermissions(user: IUser): Promise<string[]>;
}
