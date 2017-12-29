import { IItemController } from '../../framework/items';

export interface IProjectController extends IItemController {
  createNew(): void;
}
