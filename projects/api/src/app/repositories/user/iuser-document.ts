import { IManagedDocument } from '../../db';

export interface IUserDocument extends IManagedDocument {
  username?: string;
  passwordHash?: string;
  name?: string;
  email?: string;
}
