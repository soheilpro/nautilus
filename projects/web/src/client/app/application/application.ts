import EventEmitter = require('wolfy87-eventemitter');
import { Client, IClient, ISession, UnauthorizedError } from '../sdk';
import { IApplication } from './iapplication';
import { IItemModule, ItemModule } from './item';
import { IItemPriorityModule, ItemPriorityModule } from './item-priority';
import { IItemStateModule, ItemStateModule } from './item-state';
import { IItemTypeModule, ItemTypeModule } from './item-type';
import { IProjectModule, ProjectModule } from './project';
import { IUserModule, UserModule } from './user';
import { IUserRoleModule, UserRoleModule } from './user-role';
import { IRoleModule, RoleModule } from './role';

export interface IApplicationConfig {
  address: string;
}

export class Application extends EventEmitter implements IApplication {
  private client: IClient;
  private session: ISession;
  private userPermissions: string[];
  private isInitializedState: boolean;
  private isLoadedState: boolean;

  items: IItemModule;
  itemPriorities: IItemPriorityModule;
  itemStates: IItemStateModule;
  itemTypes: IItemTypeModule;
  projects: IProjectModule;
  roles: IRoleModule;
  userRoles: IUserRoleModule;
  users: IUserModule;

  constructor({ address }: IApplicationConfig) {
    super();

    const client = new Client({ address: address });

    this.client = client;
    this.items = new ItemModule(this, client);
    this.itemPriorities = new ItemPriorityModule(this, client);
    this.itemStates = new ItemStateModule(this, client);
    this.itemTypes = new ItemTypeModule(this, client);
    this.projects = new ProjectModule(this, client);
    this.userRoles = new UserRoleModule(this, client);
    this.users = new UserModule(this, client);
    this.roles = new RoleModule(this);
  }

  isInitialized(): boolean {
    return this.isInitializedState;
  }

  async initialize(session: ISession): Promise<void> {
    if (session) {
      this.session = session;
      this.client.session = session;

      // Do not neet to wait
      this.load();
    }

    this.isInitializedState = true;
    this.emit('initialize');
  }

  isLoggedIn(): boolean {
    return !!this.session;
  }

  async logIn(username: string, password: string): Promise<ISession> {
    try {
      const session = await this.client.sessions.create(username, password);

      this.session = session;
      this.client.session = session;
      this.emit('login', { session: session });

      this.load();

      return session;
    }
    catch (error) {
      if (error instanceof UnauthorizedError)
        return null;

      throw error;
    }
  }

  getSession(): ISession {
    return this.session;
  }

  getUserPermissions(): string[] {
    return this.userPermissions;
  }

  isLoaded(): boolean {
    return this.isLoadedState;
  }

  async load(): Promise<void> {
    // Put most time consuming ones first
    await Promise.all([
      this.items.load(),
      this.loadUserPermissions(),
      this.users.load(),
      this.projects.load(),
      this.userRoles.load(),
      this.itemPriorities.load(),
      this.itemStates.load(),
      this.itemTypes.load(),
      this.roles.load(),
    ]);

    this.isLoadedState = true;

    this.emit('load');
  }

  private async loadUserPermissions(): Promise<void> {
    this.userPermissions = await this.client.users.getUserPermissions(this.session.user);
  }
}
