import { IItemRelationshipService } from './item-relationship';
import { IItemService } from './item';
import { IItemPriorityService } from './item-priority';
import { IItemStateService } from './item-state';
import { IItemTypeService } from './item-type';
import { IProjectService } from './project';
import { ISessionService, ISession } from './session';
import { IUserRoleService } from './user-role';
import { IUserService } from './user';

export interface IClient {
  address: string;
  session: ISession;

  itemRelationships: IItemRelationshipService;
  items: IItemService;
  itemPriorities: IItemPriorityService;
  itemStates: IItemStateService;
  itemTypes: IItemTypeService;
  projects: IProjectService;
  sessions: ISessionService;
  userRoles: IUserRoleService;
  users: IUserService;
}
