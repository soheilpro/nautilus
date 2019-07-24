import { IChange } from '../ichange';
import { UserState } from './user-state';

export interface IUserChange extends IChange {
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  state?: UserState;
}
