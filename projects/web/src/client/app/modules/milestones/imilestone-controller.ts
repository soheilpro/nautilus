import { IItemController } from '../../framework/items';

export interface IMilestoneController extends IItemController {
  createMilestone(): void;
}
