import { IChange } from '../ichange';
import { IEntity } from '../ientity';

export interface IItemChange extends IChange {
  type?: IEntity;
  kind?: string;
  title?: string;
  description?: string;
  priority?: IEntity;
  state?: IEntity;
  tags?: string[];
  project?: IEntity;
  assignedTo?: IEntity;
  modifiedBy?: IEntity;
}
