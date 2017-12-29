import { IEntity } from '../ientity';

export interface IUser extends IEntity {
  username?: string;
  password?: string;
  name?: string;
  email?: string;
}
