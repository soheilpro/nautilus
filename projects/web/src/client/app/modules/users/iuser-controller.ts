import { IItemController } from '../../framework/items';

export interface IUserController extends IItemController {
  createNew(): void;
}
