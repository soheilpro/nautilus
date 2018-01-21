import { IItemController } from '../../framework/items';
import { IMilestone, IProject } from '../../application';

export interface IMilestoneController extends IItemController {
  createMilestone(): void;
  selectMilestone(project: IProject): Promise<IMilestone>;
}
