import { IEntity } from '../ientity';

export interface IUser extends IEntity {
  username?: string;
  password?: string;
  passwordHash?: string;
  name?: string;
  email?: string;
}
