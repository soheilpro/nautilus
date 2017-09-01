import { IMilestone } from '../application';
import { BaseCommand } from '../commands';
import { KeyCode } from '../keyboard';
import { ServiceManager } from '../services';

export default class DeleteMilestoneCommand extends BaseCommand {
  private milestoneController = ServiceManager.Instance.getMilestoneController();

  constructor(private milestone: IMilestone) {
    super();
  }

  get id() {
    return 'delete-milestone';
  }

  get title() {
    return 'Delete Milestone';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.D }];
  }

  get enabled() {
    return !!this.milestone;
  }

  execute() {
    this.milestoneController.deleteMilestone(this.milestone);
  }
}
