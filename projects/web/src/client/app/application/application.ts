import EventEmitter = require('wolfy87-eventemitter');
import { Client, IClient, ISession } from '../sdk';
import { ServiceManager } from '../services';
import { IApplication } from './iapplication';
import { IItemModule, ItemModule } from './item';
import { IItemStateModule, ItemStateModule } from './item-state';
import { IItemTypeModule, ItemTypeModule } from './item-type';
import { IProjectModule, ProjectModule } from './project';
import { IUserModule, UserModule } from './user';

export interface IApplicationConfig {
  address: string;
}

export class Application extends EventEmitter implements IApplication {
  private localStorage = ServiceManager.Instance.getLocalStorage();
  private client: IClient;
  private session: ISession;
  private isInitializedState: boolean;
  private isLoadedState: boolean;

  users: IUserModule;
  projects: IProjectModule;
  items: IItemModule;
  itemStates: IItemStateModule;
  itemTypes: IItemTypeModule;

  constructor({ address }: IApplicationConfig) {
    super();

    const client = new Client({ address: address });

    this.client = client;
    this.users = new UserModule(this, client);
    this.projects = new ProjectModule(this, client);
    this.items = new ItemModule(this, client);
    this.itemStates = new ItemStateModule(this, client);
    this.itemTypes = new ItemTypeModule(this, client);
  }

  isInitialized() {
    return this.isInitializedState;
  }

  async initialize() {
    const session = await this.localStorage.get('session') as ISession;

    if (session) {
      this.session = session;
      this.client.session = session;

      this.load();
    }

    this.isInitializedState = true;
    this.emit('initialize');
  }

  isLoggedIn() {
    return !!this.session;
  }

  async logIn(username: string, password: string): Promise<ISession> {
    const session = await this.client.sessions.create(username, password);

    if (session) {
      this.localStorage.set('session', session);

      this.session = session;
      this.client.session = session;
      this.emit('login');

      this.load();
    }

    return session;
  }

  getSession() {
    return this.session;
  }

  isLoaded() {
    return this.isLoadedState;
  }

  async load() {
    // Put most time consuming ones first
    await Promise.all([
      this.items.load(),
      this.users.load(),
      this.projects.load(),
      this.itemStates.load(),
      this.itemTypes.load(),
    ]);

    this.isLoadedState = true;

    this.emit('load');
  }
}
