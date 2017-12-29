import * as NQL from '../../nql';
import { IUser, IUserChange } from '../../sdk';
import { IModule } from '../imodule';

export interface IUserModule extends IModule {
  getAll(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): IUser[];
  get(user: IUser): IUser;
  add(user: IUser): Promise<IUser>;
  update(user: IUser, userChange: IUserChange): Promise<IUser>;
  delete(user: IUser): Promise<void>;
}
