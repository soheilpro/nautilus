import { IChange } from '../ichange';

export interface IUserChange extends IChange {
  username?: string;
  password?: string;
  name?: string;
  email?: string;
}
