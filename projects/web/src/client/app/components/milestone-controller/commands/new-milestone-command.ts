import { BaseCommand } from '../../../framework/commands';
import { ServiceManager } from '../../../services';
import { IMilestoneController } from '../../../modules/milestones';

export class NewMilestoneCommand extends BaseCommand {
  private milestoneController = ServiceManager.Instance.getService<IMilestoneController>('IMilestoneController');

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
