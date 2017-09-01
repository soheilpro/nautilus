import { IEntity } from '../ientity';

export interface IUser extends IEntity {
  username?: string;
  name?: string;
  email?: string;
}
