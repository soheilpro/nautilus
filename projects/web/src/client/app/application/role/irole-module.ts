import { IModule } from '../imodule';
import { IRole } from './irole';

export interface IRoleModule extends IModule {
  getAll(): IRole[];
}
