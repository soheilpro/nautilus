import { IChange } from '../ichange';

export interface IUserChange extends IChange {
  username?: string;
  password?: string;
  passwordHash?: string;
  name?: string;
  email?: string;
}
