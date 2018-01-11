import { IItemController } from '../../framework/items';
import { IUser } from '../../application';

export interface IUserController extends IItemController {
  createUser(): void;
  selectUser(): Promise<IUser>;
}
