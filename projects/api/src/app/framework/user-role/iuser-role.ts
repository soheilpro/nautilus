import { IEntity } from '../ientity';

export interface IUserRole extends IEntity {
  user?: IEntity;
  project?: IEntity;
  name?: string;
}
