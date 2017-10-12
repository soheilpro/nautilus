import { IUser } from './iuser';
import { Entity } from '../entity';

export class User extends Entity implements IUser {
  username?: string;
  name?: string;
  email?: string;

  constructor(data: any) {
    super(data);

    this.username = data.username;
    this.name = data.name;
    this.email = data.email;
  }
}
