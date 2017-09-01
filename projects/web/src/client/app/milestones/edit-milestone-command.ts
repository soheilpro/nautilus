import { IMilestone } from '../application';
import { BaseCommand } from '../commands';
import { KeyCode } from '../keyboard';
import { ServiceManager } from '../services';

export default class EditMilestoneCommand extends BaseCommand {
  private milestoneController = ServiceManager.Instance.getMilestoneController();

  constructor(private milestone: IMilestone) {
    super();
  }

  get id() {
    return 'edit-milestone';
  }

  get title() {
    return 'Edit Milestone';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.E }];
  }

  get enabled() {
    return !!this.milestone;
  }

  execute() {
    this.milestoneController.editMilestone(this.milestone);
  }
}
