import { IEntity } from '../ientity';

export interface IItem extends IEntity {
  sid?: number;
  kind?: string;
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  tags?: string[];
  project?: IEntity;
  assignedTo?: IEntity;
  createdBy?: IEntity;
  modifiedBy?: IEntity;
}
