import { IUser } from '../../sdk';
import { IModule } from '../imodule';

export interface IUserModule extends IModule {
  getAll(): IUser[];
  get(user: IUser): IUser;
}
