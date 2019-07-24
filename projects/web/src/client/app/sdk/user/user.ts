import { IUser } from './iuser';
import { Entity } from '../entity';
import { UserState } from './user-state';

export class User extends Entity implements IUser {
  username?: string;
  name?: string;
  email?: string;
  state?: UserState;

  constructor(data: any) {
    super(data);

    this.username = data.username;
    this.name = data.name;
    this.email = data.email;
    this.state = data.state;
  }
}
