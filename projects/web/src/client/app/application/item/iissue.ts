import { IEntity, IItemType, IItemState, IProject, IUser } from '../../sdk';
import { IMilestone } from './imilestone';
import { IIssue } from './iissue';

export interface IIssue extends IEntity {
  sid?: number;
  type?: IItemType;
  title?: string;
  description?: string;
  priority?: IItemState;
  state?: IItemState;
  tags?: string[];
  project?: IProject;
  assignedTo?: IUser;
  createdBy?: IUser;
  modifiedBy?: IUser;
  parent?: IIssue;
  milestone?: IMilestone;
}
