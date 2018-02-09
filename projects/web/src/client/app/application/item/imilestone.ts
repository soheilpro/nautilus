import { IEntity, IItemState, IProject, IUser } from '../../sdk';

export interface IMilestone extends IEntity {
  sid?: string;
  title?: string;
  fullTitle?: string;
  smartTitle?: string;
  description?: string;
  state?: IItemState;
  project?: IProject;
  createdBy?: IUser;
  modifiedBy?: IUser;
}
