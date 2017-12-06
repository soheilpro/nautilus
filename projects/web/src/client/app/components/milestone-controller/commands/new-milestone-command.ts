import { BaseCommand } from '../../../framework/commands';
import { ServiceManager } from '../../../services';
import { IMilestoneController } from '../../../modules/milestones';

export class NewMilestoneCommand extends BaseCommand {
  private milestoneController = ServiceManager.Instance.getService<IMilestoneController>('IMilestoneController');

  get id() {
    return 'new-milestone';
  }

  get title() {
    return 'New Milestone';
  }

  execute() {
    this.milestoneController.createNew();
  }
}
