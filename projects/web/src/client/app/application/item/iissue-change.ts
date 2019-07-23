import { IEntity } from '../../sdk';

export interface IIssueChange {
  type?: IEntity;
  title?: string;
  description?: string;
  priority?: IEntity;
  state?: IEntity;
  tags?: string[];
  project?: IEntity;
  milestone?: IEntity;
  assignedTo?: IEntity;
}
