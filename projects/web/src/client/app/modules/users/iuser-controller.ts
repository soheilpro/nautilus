import { IItemController } from '../../framework/items';
import { IUser } from '../../application';

export interface IUserController extends IItemController {
  createNew(): void;
  selectUser(): Promise<IUser>;
}
