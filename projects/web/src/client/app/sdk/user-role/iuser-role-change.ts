import { IChange } from '../ichange';
import { IEntity } from '../ientity';

export interface IUserRoleChange extends IChange {
  user?: IEntity;
  role?: string;
  project?: IEntity;
}
