import { IManagedDocument } from '../../db';
import { UserState } from '../../framework/user';

export interface IUserDocument extends IManagedDocument {
  username?: string;
  passwordHash?: string;
  name?: string;
  email?: string;
  state?: UserState;
}
