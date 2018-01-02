import * as NQL from '../../nql';
import { IUserRole, IUserRoleChange } from '../../sdk';
import { IModule } from '../imodule';

export interface IUserRoleModule extends IModule {
  getAll(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): IUserRole[];
  get(userRole: IUserRole): IUserRole;
  add(userRole: IUserRole): Promise<IUserRole>;
  update(userRole: IUserRole, userRoleChange: IUserRoleChange): Promise<IUserRole>;
  delete(userRole: IUserRole): Promise<void>;
}
