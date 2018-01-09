import { BaseCommand } from '../../../framework/commands';
import { IMilestoneController } from '../../../modules/milestones';

export class NewMilestoneCommand extends BaseCommand {
  constructor(private milestoneController: IMilestoneController) {
    super();
  }

  get id(): string {
    return 'new-milestone';
  }

  get title(): string {
    return 'New Milestone';
  }

  execute(): void {
    this.milestoneController.createNew();
  }
}
