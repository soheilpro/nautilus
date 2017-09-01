import { BaseCommand } from '../commands';
import { KeyCode } from '../keyboard';
import { ServiceManager } from '../services';

export default class NewMilestoneCommand extends BaseCommand {
  private milestoneController = ServiceManager.Instance.getMilestoneController();

  get id() {
    return 'new-milestone';
  }

  get title() {
    return 'New Milestone';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.N }];
  }

  execute() {
    this.milestoneController.addMilestone();
  }
}
