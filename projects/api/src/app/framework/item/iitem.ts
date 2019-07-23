import { IEntity } from '../ientity';

export interface IItem extends IEntity {
  sid?: string;
  kind?: string;
  type?: IEntity;
  title?: string;
  description?: string;
  priority?: IEntity;
  state?: IEntity;
  tags?: string[];
  project?: IEntity;
  assignedTo?: IEntity;
  createdBy?: IEntity;
  modifiedBy?: IEntity;
}
