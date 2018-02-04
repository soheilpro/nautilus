import { ISession } from '../sdk';
import { IItemModule } from './item';
import { IItemStateModule } from './item-state';
import { IItemTypeModule } from './item-type';
import { IProjectModule } from './project';
import { IRoleModule } from './role';
import { IUserModule } from './user';
import { IUserRoleModule } from './user-role';

export interface IApplication extends IEventEmitter {
  isInitialized(): boolean;
  initialize(session: ISession): void;

  isLoggedIn(): boolean;
  logIn(username: string, password: string): Promise<ISession>;

  isLoaded(): boolean;
  load(): void;

  getSession(): ISession;
  getUserPermissions(): string[];

  items: IItemModule;
  itemStates: IItemStateModule;
  itemTypes: IItemTypeModule;
  projects: IProjectModule;
  roles: IRoleModule;
  userRoles: IUserRoleModule;
  users: IUserModule;
}
