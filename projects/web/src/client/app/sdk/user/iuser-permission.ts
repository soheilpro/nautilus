import { IEntity } from '../ientity';

export interface IUserPermission extends IEntity {
  project?: IEntity;
  name: string;
}
