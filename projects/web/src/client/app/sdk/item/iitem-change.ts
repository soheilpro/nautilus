import { IEntity } from '../ientity';
import { IChange } from '../ichange';

export interface IItemChange extends IChange {
  type?: IEntity;
  title?: string;
  description?: string;
  priority?: IEntity;
  state?: IEntity;
  tags?: string[];
  project?: IEntity;
  assignedTo?: IEntity;
}
