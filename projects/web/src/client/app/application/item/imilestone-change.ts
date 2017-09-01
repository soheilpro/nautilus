import { IEntity } from '../../sdk';

export interface IMilestoneChange {
  title?: string;
  description?: string;
  state?: IEntity;
  project?: IEntity;
}
