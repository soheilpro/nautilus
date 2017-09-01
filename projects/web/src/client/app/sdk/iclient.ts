import { IItemRelationshipService } from './item-relationship';
import { IItemService } from './item';
import { IItemStateService } from './item-state';
import { IItemTypeService } from './item-type';
import { IProjectService } from './project';
import { ISessionService, ISession } from './session';
import { IUserService } from './user';

export interface IClient {
  address: string;
  session: ISession;
  users: IUserService;
  sessions: ISessionService;
  projects: IProjectService;
  itemStates: IItemStateService;
  itemTypes: IItemTypeService;
  items: IItemService;
  itemRelationships: IItemRelationshipService;
}
