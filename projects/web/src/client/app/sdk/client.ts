import { IClient } from './iclient';
import { IItemRelationshipService, ItemRelationshipService } from './item-relationship';
import { ItemService, IItemService } from './item';
import { ItemStateService, IItemStateService } from './item-state';
import { ItemTypeService, IItemTypeService } from './item-type';
import { UserRoleService, IUserRoleService } from './user-role';
import { ProjectService, IProjectService } from './project';
import { SessionService, ISessionService, ISession } from './session';
import { UserService, IUserService } from './user';

interface IClientConfig {
  address: string;
}

export class Client implements IClient {
  address: string;
  session: ISession;

  itemRelationships: IItemRelationshipService;
  items: IItemService;
  itemStates: IItemStateService;
  itemTypes: IItemTypeService;
  projects: IProjectService;
  sessions: ISessionService;
  userRoles: IUserRoleService;
  users: IUserService;

  constructor({ address }: IClientConfig) {
    this.address = address;

    this.itemRelationships = new ItemRelationshipService(this);
    this.items = new ItemService(this);
    this.itemStates = new ItemStateService(this);
    this.itemTypes = new ItemTypeService(this);
    this.projects = new ProjectService(this);
    this.sessions = new SessionService(this);
    this.userRoles = new UserRoleService(this);
    this.users = new UserService(this);
  }
}
