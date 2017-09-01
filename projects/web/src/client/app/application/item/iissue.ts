import { IEntity, IItemType, IItemState, IProject, IUser } from '../../sdk';
import { IMilestone } from './imilestone';
import { IIssue } from './iissue';

export interface IIssue extends IEntity {
  sid?: string;
  type?: IItemType;
  title?: string;
  description?: string;
  state?: IItemState;
  tags?: string[];
  project?: IProject;
  assignedTo?: IUser;
  createdBy?: IUser;
  modifiedBy?: IUser;
  parent?: IIssue;
  milestone?: IMilestone;
}
