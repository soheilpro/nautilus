import { IEntity } from '../ientity';

export interface IUserLog extends IEntity {
  dateTime?: Date;
  user?: IEntity;
  action?: string;
  item?: IEntity;
  params?: any;
}
