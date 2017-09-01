import { IEntity } from '../ientity';
import { IUser } from '../user';

export interface ISession extends IEntity {
  accessToken: string;
  user: IUser;
}
