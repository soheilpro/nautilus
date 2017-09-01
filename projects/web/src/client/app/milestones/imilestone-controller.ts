import { IMilestone } from '../application';

export interface IMilestoneController {
  addMilestone(): void;
  editMilestone(milestone: IMilestone): void;
  deleteMilestone(milestone: IMilestone): void;
}
