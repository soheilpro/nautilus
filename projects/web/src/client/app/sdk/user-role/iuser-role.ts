import { IEntity } from '../ientity';

export interface IUserRole extends IEntity {
  user?: IEntity;
  role?: string;
  project?: IEntity;
}
