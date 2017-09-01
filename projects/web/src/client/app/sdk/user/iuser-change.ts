import { IChange } from '../ichange';

export interface IUserChange extends IChange {
  username?: string;
  name?: string;
  email?: string;
}
