import { IItemController } from '../../framework/items';

export interface IUserRoleController extends IItemController {
  createUserRole(): void;
}
