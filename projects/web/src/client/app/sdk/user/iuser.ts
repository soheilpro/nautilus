import { IEntity } from '../ientity';
import { UserState } from './user-state';

export interface IUser extends IEntity {
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  state?: UserState;
}
