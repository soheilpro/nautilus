import { IClient } from './iclient';
import { IItemRelationshipService, ItemRelationshipService } from './item-relationship';
import { ItemService, IItemService } from './item';
import { ItemStateService, IItemStateService } from './item-state';
import { ItemTypeService, IItemTypeService } from './item-type';
import { ProjectService, IProjectService } from './project';
import { SessionService, ISessionService, ISession } from './session';
import { UserService, IUserService } from './user';

interface IClientConfig {
  address: string;
}

export class Client implements IClient {
  address: string;
  session: ISession;
  users: IUserService;
  sessions: ISessionService;
  projects: IProjectService;
  itemStates: IItemStateService;
  itemTypes: IItemTypeService;
  items: IItemService;
  itemRelationships: IItemRelationshipService;

  constructor({ address }: IClientConfig) {
    this.address = address;
    this.users = new UserService(this);
    this.sessions = new SessionService(this);
    this.projects = new ProjectService(this);
    this.itemStates = new ItemStateService(this);
    this.itemTypes = new ItemTypeService(this);
    this.items = new ItemService(this);
    this.itemRelationships = new ItemRelationshipService(this);
  }
}
