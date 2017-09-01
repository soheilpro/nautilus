import { IUser } from '../../framework/user';
import { EntityModelBase } from '../entity-model-base';

export class UserModel extends EntityModelBase {
  username?: string;
  name?: string;
  email?: string;

  constructor(entity: IUser) {
    super(entity);

    this.username = entity.username;
    this.name = entity.name;
    this.email = entity.email;
  }
}
