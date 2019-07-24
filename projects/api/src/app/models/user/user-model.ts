import { IUser, UserState } from '../../framework/user';
import { EntityModelBase } from '../entity-model-base';

export class UserModel extends EntityModelBase {
  username?: string;
  name?: string;
  email?: string;
  state?: UserState;

  constructor(entity: IUser) {
    super(entity);

    this.username = entity.username;
    this.name = entity.name;
    this.email = entity.email;
    this.state = entity.state;
  }
}
