import { IEntity } from '../ientity';
import { UserState } from './user-state';

export interface IUser extends IEntity {
  username?: string;
  password?: string;
  passwordHash?: string;
  name?: string;
  email?: string;
  state?: UserState;
}
