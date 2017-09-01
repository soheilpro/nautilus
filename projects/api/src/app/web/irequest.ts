import * as restify from 'restify';
import { IUser } from '../framework/user';

export interface IRequest extends restify.Request {
  user?: IUser;
  permissions?: string[];
}
