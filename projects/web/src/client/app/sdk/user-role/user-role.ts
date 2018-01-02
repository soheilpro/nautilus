import { IUserRole } from './iuser-role';
import { IEntity } from '../ientity';
import { Entity } from '../entity';

export class UserRole extends Entity implements IUserRole {
  user?: IEntity;
  role?: string;
  project?: IEntity;

  constructor(data: any) {
    super(data);

    this.user = data.user;
    this.role = data.role;
    this.project = data.project;
  }
}
