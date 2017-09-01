import { IEntity } from '../ientity';

export interface ISession extends IEntity {
  accessToken?: string;
  user?: IEntity;
}
